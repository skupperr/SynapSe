"use client"

import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth-client";

export const HomeView = () => {
  const {data : session} = authClient.useSession();

  if(!session){
    return (
      <p>Loading...</p>
    )
  }
  return (
    <div>
      <p>{session.user.name}</p>
      <Button onClick={()=>authClient.signOut()}>Sign Out</Button>
    </div>
  );
}
