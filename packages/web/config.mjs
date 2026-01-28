const stage = process.env.SST_STAGE || "dev"

// Handle Vercel deployments
const getUrl = () => {
  // Vercel preview/production URLs
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`
  }
  // SST stages
  if (stage === "production") return "https://innocode.io"
  return `https://${stage}.innocode.io`
}

export default {
  url: getUrl(),
  console: stage === "production" ? "https://innocode.io/auth" : `https://${stage}.innocode.io/auth`,
  email: "contact@innogpt.de",
  socialCard: "https://social-cards.sst.dev",
  github: "https://github.com/InnoKI/innocode",
  slack: "#", // TODO: Add Slack invite link
  headerLinks: [
    { name: "app.header.home", url: "/" },
    { name: "app.header.docs", url: "/" },
  ],
}
