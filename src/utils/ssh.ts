import chalk from "chalk";
const { NodeSSH } = require("node-ssh");

const pipeStream = (stream: any) => {
  const { stdin, stdout, stderr } = process;
  const { isTTY } = stdout;

  if (isTTY && stdin.setRawMode) {
    stdin.setRawMode(true);
  }

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
    if (isTTY) {
      process.stdout.removeListener("resize", onResize);
    }

    stream.unpipe();
    stream.stderr.unpipe();
    stdin.unpipe();

    if (stdin.setRawMode) {
      stdin.setRawMode(false);
    }

    stdin.unref();
  });
};

export default async function sshUtil(host: string, username: string, privateKey: string | undefined, password: string, port: number): Promise<void> {
  const ssh = new NodeSSH();

  const connectOptions: any = {
    host: host,
    port: port,
    username: username
  };

  if (password) {
    connectOptions.password = password;
  } else {
    connectOptions.privateKey = privateKey;
  }

  try {
    await ssh.connect(connectOptions);
  } catch (error: any) {
    if (error.message === "All configured authentication methods failed") {
      console.log(`${chalk.red("[ERROR]")} Invalid username or ${password ? "password" : "private key"}`);
      return;
    }

    if (error.message === "Timed out while waiting for handshake") {
      console.log(`${chalk.red("[ERROR]")} Timed out while waiting for handshake`);
      return;
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
