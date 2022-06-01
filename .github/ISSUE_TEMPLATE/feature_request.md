---
name: Feature Request
about: Request a feature or enhancement
title: ''
labels: ["enhancement"]
assignees: HariboDev
body:
  - type: markdown
    attributes:
      value: |
        Thanks for taking the time to fill out this feature request!
  - type: input
    id: contact
    attributes:
      label: Contact details
      description: How can we get in touch with you if we need more info?
      placeholder: ex. email@example.com
    validations:
      required: false
  - type: textarea
    id: solution-description
    attributes:
      label: Describe the solution you'd like
      description: A clear concise description of what you want to happen.
      placeholder: Tell us what you want to see!
    validations:
      required: true
  - type: textarea
    id: additional-context
    attributes:
      label: Additional context
      description: Add any other context about the feature request here.
      placeholder: Anything else?
    validations:
      required: false