"use client";

import { Message, User } from "../app/types";
import { formatDistanceToNow } from "date-fns";
import Image from "next/image";

interface ChatMessageProps {
  message: Message;
  currentUser: User;
  otherUser: User;
}

export function ChatMessage({
  message,
  currentUser,
  otherUser,
}: ChatMessageProps) {
  const isCurrentUser = message.senderId === currentUser.id;
  const user = isCurrentUser ? currentUser : otherUser;

  return (
    <div
      className={`flex ${isCurrentUser ? "justify-end" : "justify-start"} mb-4`}
    >
      {!isCurrentUser && (
        <div className="relative h-8 w-8 rounded-full overflow-hidden mr-2 flex-shrink-0">
          <Image
            src={user.image}
            alt={user.name}
            fill
            className="object-cover"
          />
        </div>
      )}

      <div
        className={`max-w-[75%] ${
          isCurrentUser
            ? "bg-blue-600 text-white rounded-l-lg rounded-tr-lg"
            : "bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white rounded-r-lg rounded-tl-lg"
        } px-4 py-2 shadow-sm`}
      >
        <p>{message.content}</p>
        <div
          className={`text-xs mt-1 ${
            isCurrentUser ? "text-blue-200" : "text-gray-500 dark:text-gray-400"
          }`}
        >
          {formatDistanceToNow(message.createdAt, { addSuffix: true })}
        </div>
      </div>

      {isCurrentUser && (
        <div className="relative h-8 w-8 rounded-full overflow-hidden ml-2 flex-shrink-0">
          <Image
            src={user.image}
            alt={user.name}
            fill
            className="object-cover"
          />
        </div>
      )}
    </div>
  );
}

export function ChatBox({
  product,
  currentUser,
}: {
  product: { id: string; owner: User };
  currentUser: User;
}) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 mt-6">
      <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">
        Contact Seller
      </h3>

      <div className="border rounded-lg border-gray-200 dark:border-gray-700 h-64 mb-4 overflow-y-auto p-4 bg-gray-50 dark:bg-gray-900">
        <div className="text-center text-gray-500 dark:text-gray-400 text-sm py-8">
          Start a conversation with the seller about this item.
        </div>
      </div>

      <form className="flex">
        <input
          type="text"
          placeholder="Type a message..."
          className="flex-grow rounded-l-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 px-4 py-2 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          type="submit"
          className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-r-lg transition-colors"
        >
          Send
        </button>
      </form>
    </div>
  );
}
