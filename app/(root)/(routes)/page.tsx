"use client"

import { useStoreModal } from "@/hooks/use-store-modal";
import { useEffect } from "react";

import { useSession } from "next-auth/react";
import { redirect, useRouter } from "next/navigation";

const SetUpPage = () => {

  const isOpen = useStoreModal((store) => store.isOpen)
  const onOpen = useStoreModal((store) => store.onOpen)

  const { data: session, status } = useSession();
  console.log(session)

  useEffect(() => {
    console.log(isOpen)
    if (!isOpen) {
      onOpen()
    }
  }, [isOpen, onOpen])

  useEffect(() => {
    if (status === "loading") {
      return;
    }

    if (!session) {
      redirect('/login')
    }
  }, [status, session]);

  if (status === "loading") {
    return <div>Loading...</div>;
  }

  return <></>
}

export default SetUpPage;


