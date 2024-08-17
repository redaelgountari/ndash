import { getSession } from 'next-auth/react';

export default function ProtectedPage({ user }) {
  return <div>Welcome, {user.name}! This is a protected page.</div>;
}

export async function getServerSideProps(context) {
  const session = await getSession(context);

  if (!session) {
    return {
      redirect: {
        destination: '/auth/signin',
        permanent: false,
      },
    };
  }

  return {
    props: { user: session.user },
  };
}
