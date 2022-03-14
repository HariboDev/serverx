import chalk from "chalk";
const { NodeSSH } = require("node-ssh");

const pipeStream = (stream: any) => {
  const { stdin, stdout, stderr } = process;
  const { isTTY } = stdout;

  if (isTTY && stdin.setRawMode) stdin.setRawMode(true);

  stream.pipe(stdout);
  stream.stderr.pipe(stderr);
  stdin.pipe(stream);

  const onResize: any =
    isTTY && (() => {
      const { columns, rows } = stdout;
      return stream.setWindow(rows, columns, null, null);
    });

  if (isTTY) {
    stream.once("data", onResize);
    const { stdout } = process;
    stdout.on("resize", onResize);
  }

  stream.on("close", () => {
    if (isTTY) process.stdout.removeListener("resize", onResize);
    stream.unpipe();
    stream.stderr.unpipe();
    stdin.unpipe();
    if (stdin.setRawMode) stdin.setRawMode(false);
    stdin.unref();
  });
};

export default async function sshUtil(host: string, username: string, privateKey: string | undefined, password: string): Promise<void> {
  const ssh = new NodeSSH();

  if (password) {
    try {
      await ssh.connect({
        host: host,
        port: 22,
        username: username,
        password: password
      });
    } catch (error: any) {
      if (error.message === "All configured authentication methods failed") {
        console.log(`${chalk.red("[ERROR]")} Invalid username or password`);
        return;
      }

      if (error.message === "Timed out while waiting for handshake") {
        console.log(`${chalk.red("[ERROR]")} Timed out while waiting for handshake`);
        return;
      }
    }
  } else {
    try {
      await ssh.connect({
        host: host,
        port: 22,
        username: username,
        privateKey: privateKey
      });
    } catch (error: any) {
      if (error.message === "All configured authentication methods failed") {
        console.log(`${chalk.red("[ERROR]")} Invalid username or private key`);
        return;
      }

      if (error.message === "Timed out while waiting for handshake") {
        console.log(`${chalk.red("[ERROR]")} Timed out while waiting for handshake`);
        return;
      }
    }
  }

  await new Promise((resolve, reject) => {
    ssh.connection.shell({ term: process.env.TERM || "vt100" }, (err: any, stream: any) => {
      if (err) {
        reject(err);
        return;
      }

      pipeStream(stream);
      stream.on("close", () => resolve(true));
    });
  });

  ssh.dispose();
}
