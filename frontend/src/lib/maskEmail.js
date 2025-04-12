export function maskEmail(email) {
    const [name, domain] = email.split("@")
    const masked =
      name.length <= 2
        ? name[0] + "*".repeat(name.length - 1)
        : name[0] + "*".repeat(name.length - 2) + name[name.length - 1]
    return `${masked}@${domain}`
  }