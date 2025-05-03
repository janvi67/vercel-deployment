  import { X } from "lucide-react";
  import { useNavigate } from "react-router-dom";
  import { useAuthStore } from "../store/useAuthStore";
  import { useChatStore } from "../store/useChatStore";
  import { EllipsisVertical,Video } from "lucide-react";
  import toast from "react-hot-toast";

  const ChatHeader = () => {
    const { selectedUser, setSelectedUser } = useChatStore();

    const { onlineUsers } = useAuthStore();

    const { deleteAllMessages, messages } = useChatStore();

    console.log("🚀 ~ ChatHeader ~ messages:", messages);

  const navigate=useNavigate();

    const handleDeleteAllMessages = async (messages) => {
      if (window.confirm("Are you sure you want to delete this message?")) {
        try {
          console.log("come in try block");
          if (messages <= 0) {
            toast.error("no message are there to delete");
          } else {
            const selectedUserId=selectedUser._id
              await deleteAllMessages(selectedUserId);
            
            toast.success("All messages deleted successfully.");
          }
        } catch (error) {
          console.error("Failed to delete all messages:", error);
        }
      }
    };

    return (
      <div className="p-2.5 border-b border-base-300">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {/* Avatar */}
            <div className="avatar">
              <div className="size-10 rounded-full relative">
                <img
                  src={selectedUser.profilePic || "/avatar.png"}
                  alt={selectedUser.fullName}
                />
              </div>
            </div>

            {/* User info */}
            <div>
              <h3 className="font-medium">{selectedUser.fullName}</h3>
              <p className="text-sm text-base-content/70">
                {onlineUsers.includes(selectedUser._id) ? "Online" : "Offline"}
              </p>
            </div>
          </div>

          <div className="flex gap-5">
            <button
              popoverTarget="popover-1"
              style={{
                anchorName: "--anchor-1",
              }}
            >
              <EllipsisVertical />
              <ul
                className="dropdown menu w-52 rounded-box bg-base-100 shadow-sm"
                popover="auto"
                id="popover-1"
                style={{
                  positionAnchor: "--anchor-1",
                }}
              >
                <li>
                  <a onClick={() => handleDeleteAllMessages(messages)}>
                    Delete All Messages
                  </a>
                </li>

                <li>
                  <a onClick={() => console.log("Other Action")}>Other Action</a>
                </li>
              </ul>
            </button>
            <button onClick={()=>navigate(`/lobby/${selectedUser._id}`)} >
            <Video />
            
            </button>

            <button onClick={() => { 
                navigate("/"); 
    setSelectedUser(null);  
  
}}>
  <X />
</button>

          </div>
        </div>
      </div>
    );
  };
  export default ChatHeader;
