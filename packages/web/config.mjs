const stage = process.env.SST_STAGE || "dev"

export default {
  url: stage === "production" ? "https://innocode.io" : `https://${stage}.innocode.io`,
  console: stage === "production" ? "https://innocode.io/auth" : `https://${stage}.innocode.io/auth`,
  email: "contact@innogpt.de",
  socialCard: "https://social-cards.sst.dev",
  github: "https://github.com/InnoKI/innocode",
  slack: "#", // TODO: Add Slack invite link
  headerLinks: [
    { name: "app.header.home", url: "/" },
    { name: "app.header.docs", url: "/docs/" },
  ],
}
