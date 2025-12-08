import { Members } from "pusher-js";
import useActiveList from "./useActiveList";
import { useEffect, useRef } from "react";
import { pusherClient } from "../libs/pusher";

const useActiveChannel = () => {
  const { set, add, remove } = useActiveList();
  const channelRef = useRef<any>(null);
  const subscribedRef = useRef(false);

  useEffect(() => {
    // Only subscribe once
    if (subscribedRef.current) {
      console.log('[Presence] Already subscribed, skipping');
      return;
    }

    console.log('[Presence] Starting subscription to presence-messenger');

    try {
      const channel = pusherClient.subscribe('presence-messenger');
      channelRef.current = channel;
      subscribedRef.current = true;

      // Event: When subscription succeeds, get all current members
      const handleSubscriptionSucceeded = (members: Members) => {
        const initialMembers: string[] = [];
        members.each((member: Record<string, any>) => {
          initialMembers.push(member.id);
        });
        set(initialMembers);
        console.log('[Presence] ✅ Subscription succeeded. Members:', initialMembers);
      };

      // Event: When a new member joins
      const handleMemberAdded = (member: Record<string, any>) => {
        console.log('[Presence] ✅ Member joined:', member.id);
        add(member.id);
      };

      // Event: When a member leaves
      const handleMemberRemoved = (member: Record<string, any>) => {
        console.log('[Presence] ❌ Member left:', member.id);
        remove(member.id);
      };

      // Bind all event handlers
      channel.bind('pusher:subscription_succeeded', handleSubscriptionSucceeded);
      channel.bind('pusher:member_added', handleMemberAdded);
      channel.bind('pusher:member_removed', handleMemberRemoved);

      // Listen for subscription errors
      channel.bind('pusher:subscription_error', (error: any) => {
        console.error('[Presence] Subscription error:', error);
      });

      console.log('[Presence] Event handlers bound successfully');
    } catch (error) {
      console.error('[Presence] Subscription error:', error);
    }

    // Cleanup is minimal - we DON'T unsubscribe because presence should stay active
    return () => {
      // Don't unsubscribe on unmount - presence should persist
      console.log('[Presence] Component unmounting but keeping subscription active');
    };
  }, []); // Empty deps - subscribe once only

  return null;
};

export default useActiveChannel;