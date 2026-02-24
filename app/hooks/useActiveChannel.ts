import { useEffect } from "react";
import { pusherClient } from "../libs/pusher";
import useActiveList from "./useActiveList";

export default function useActiveChannel() {
  const { set, add, remove } = useActiveList();

  useEffect(() => {
    let channel: any;

    try {
      channel = pusherClient.subscribe("presence-messenger");

      channel.bind("pusher:subscription_succeeded", (members: any) => {
        const initialIds: string[] = [];
        members.each((member: any) => {
          initialIds.push(member.id);
        });
        set(initialIds);
        console.log("[PRESENCE] Subscribed, members:", initialIds);
      });

      channel.bind("pusher:member_added", (member: any) => {
        add(member.id);
        console.log("[PRESENCE] Member added:", member.id);
      });

      channel.bind("pusher:member_removed", (member: any) => {
        remove(member.id);
        console.log("[PRESENCE] Member removed:", member.id);
      });

      channel.bind("pusher:subscription_error", (error: any) => {
        console.error("[PRESENCE] Subscription error:", error);
      });
    } catch (error) {
      console.error("[PRESENCE] Error subscribing:", error);
    }

    return () => {
      if (channel) {
        try {
          pusherClient.unsubscribe("presence-messenger");
        } catch (e) {
          // ignore
        }
      }
    };
  }, [set, add, remove]);

  return null;
}