import { signIn, useSession, signOut } from 'next-auth/react'


export default function Home() {
  const { data } = useSession()
  console.log(data);

  return (
    <>
      <h1>Golden Chat</h1>
      {data ? <><h2>Logged in as {data?.user?.name}</h2>
        <button onClick={() => signOut()}>Sign out</button></> :
        <><h2>Not signed in</h2>
          <button onClick={() => signIn('google')}>Sign in</button></>
      }
    </>
  )
}
