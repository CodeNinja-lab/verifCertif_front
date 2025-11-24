export default function CertificationsPage() {
  return null
}

export async function generateMetadata() {
  return {
    redirect: {
      destination: "/university/degrees",
      permanent: true,
    },
  }
}
