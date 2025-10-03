import { useState, useRef, useEffect } from "react";
import Tweet from "./Tweet";
import { Avatar } from "@mui/material";
import ImageIcon from "@mui/icons-material/Image";
import GifIcon from "@mui/icons-material/Gif";
import PollIcon from "@mui/icons-material/Poll";
import EmojiEmotionsIcon from "@mui/icons-material/EmojiEmotions";
import ScheduleIcon from "@mui/icons-material/Schedule";
import MicIcon from "@mui/icons-material/Mic";

// Hardcoded example tweets
const exampleTweets = [
{
      id: 1,
      name: "Elon Musk",
      username: "@elonmusk",
      avatar: "/avatars/elonMusk.jpg",
      content: "Entering Twitter HQ — let that sink in!",
      image: "/avatars/elonTweet.jpg",
      likes: 12000,
      comments: 4300,
      createdAt: "Sep 27, 2025",
    },
    {
      id: 2,
      name: "Sundar Pichai",
      username: "@sundarpichai",
      avatar: "/avatars/sundar.jpg",
      content: "Make that 5 billion and 1 😂",
      image: "/avatars/sundarTweet.jpg",
      likes: 8900,
      comments: 1200,
      createdAt: "Sep 25, 2025",
    },
    {
      id: 3,
      name: "NASA",
      username: "@nasa",
      avatar: "https://pbs.twimg.com/profile_images/1321163587679784960/0ZxKlEKB_400x400.jpg",
      content: "Next stop: Mars 🪐",
      image: "https://pbs.twimg.com/profile_images/1321163587679784960/0ZxKlEKB_400x400.jpg",
      likes: 25000,
      comments: 7800,
      createdAt: "Sep 20, 2025",
    },
    {
      id: 4,
      name: "Bill Gates",
      username: "@BillGates",
      avatar: "/avatars/billGates.jpg",
      content: "This surprised me: there’s more carbon in soil than in the atmosphere and all plant life combined.",
      image: "/avatars/billTweet.jpg",
      likes: 15000,
      comments: 4000,
      createdAt: "Sep 18, 2025",
    },
    {
      id: 5,
      name: "Cristiano Ronaldo",
      username: "@Cristiano",
      avatar: "/avatars/ronaldo.jpg",
      content: "This is Al Nassr! This is who we are! 🔥",
      image: "/avatars/ronaldoTweet.jpg",
      likes: 90000,
      comments: 12000,
      createdAt: "Sep 15, 2025",
    },
    {
      id: 6,
      name: "Jeff Bezos",
      username: "@JeffBezos",
      avatar: "/avatars/zeff.jpg",
      content: "Amazon is working with first responders, nonprofit partners and humanitarian relief agencies on the ground in Los Angeles to get them thousands of vital supplies. The team will continue to support relief efforts in coordination with community partners and humanitarian organizations in the coming weeks.",
      image: "/avatars/jeffTweet.jpg",
      likes: 34000,
      comments: 8900,
      createdAt: "Sep 10, 2025",
    },
    {
      id: 7,
      name: "ISRO",
      username: "@isro",
      avatar: "/avatars/isro.jpg",
      content: `Celebrating a decade of AstroSat: India’s first observatory dedicated for astronomy
On this day 10 years ago #AstroSat 🛰️✨, India’s first multi wavelength astronomy observatory was launched by ISRO. From black holes to neutron stars, from the nearest star Proxima Centauri to first time detection of FUV photons from galaxies 9.3 billion light years away,  AstroSat enabled groundbreaking insights across the electromagnetic spectrum from UV/Visible to high energy X-rays.
Congratulating AstroSat for a successful decade and wishing many more years of exciting results and discoveries !`,
      image: "/avatars/ISROTweet.jpg",
      likes: 5600,
      comments: 800,
      createdAt: "Sep 8, 2025",
    },
    {
      id: 8,
      name: "Mark Zuckerberg",
      username: "@finkd",
      avatar: "/avatars/zuck.jpg",
      content: null,
      image: "/avatars/zuckTweet.jpg",
      likes: 67000,
      comments: 5400,
      createdAt: "Sep 5, 2025",
    },
    {
      id: 9,
      name: "Taylor Swift",
      username: "@taylorswift13",
      avatar: "/avatars/swift.jpg",
      content: `I hereby invite you to a *dazzling* soirée, The Official Release Party of a Showgirl: Oct 3 - Oct 5 only in cinemas! You’ll get to see the exclusive world premiere of the music video for my new single “The Fate of Ophelia”, along with never before seen behind-the-scenes footage of how we made it, cut by cut explanations of what inspired this music, and the brand new lyric videos from my new album The Life of a Showgirl ❤️‍🔥

        Looks like it's time to brush off that Eras Tour outfit or orange cardigan… Tickets are on sale now. Dancing is optional but very much encouraged 💃`,
      image: "/avatars/swiftTweet.jpg",
      likes: 120000,
      comments: 34000,
      createdAt: "Sep 2, 2025",
    },
];

export default function Feed({ userEmail, user }) {
  const [tweets, setTweets] = useState([]);
  const [content, setContent] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const fileInputRef = useRef();

  // Audio states
  const [recording, setRecording] = useState(false);
  const [audioBlob, setAudioBlob] = useState(null);
  const [otpSent, setOtpSent] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);
  const [otpInput, setOtpInput] = useState("");
  const mediaRecorder = useRef(null);
  const audioChunks = useRef([]);

  const checkTime = () => {
    const now = new Date();
    const utc = now.getTime() + now.getTimezoneOffset() * 60000;
    const istOffset = 5.5 * 60 * 60000;
    const ist = new Date(utc + istOffset);
    const hour = ist.getHours();
    return hour >= 14 && hour <= 23;
  };

  const startRecording = async () => {
    if (!checkTime()) return alert("Audio allowed only between 2 PM - 11 PM IST");

    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    mediaRecorder.current = new MediaRecorder(stream);
    audioChunks.current = [];

    mediaRecorder.current.ondataavailable = (e) => audioChunks.current.push(e.data);
    mediaRecorder.current.onstop = () => {
      const blob = new Blob(audioChunks.current, { type: "audio/webm" });
      if (blob.size > 100 * 1024 * 1024) return alert("Audio exceeds 100MB");
      setAudioBlob(blob);
    };

    mediaRecorder.current.start();
    setRecording(true);

    setTimeout(() => {
      if (recording) stopRecording();
    }, 5 * 60 * 1000);
  };

  const stopRecording = () => {
    mediaRecorder.current.stop();
    setRecording(false);
  };

  const sendOtp = async () => {
    await fetch("http://localhost:5000/api/audio/send-otp", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: userEmail }),
    });
    setOtpSent(true);
    alert("OTP sent to your email");
  };

  const verifyOtp = async () => {
    const res = await fetch("http://localhost:5000/api/audio/verify-otp", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: userEmail, otp: otpInput }),
    });
    const data = await res.json();
    if (data.success) {
      setOtpVerified(true);
      alert("OTP verified");
    } else {
      alert("Invalid OTP");
    }
  };

  const handleTweet = async () => {
    if (!content.trim() && !imageFile && !audioBlob) return;

    const formData = new FormData();
    formData.append("text", content);
    if (imageFile) formData.append("image", imageFile);
    if (audioBlob) formData.append("audio", audioBlob);

    try {
      const res = await fetch("http://localhost:5000/api/posts", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: formData,
      });

     if (!res.ok) {
        const errMsg = await res.text();
        throw new Error(errMsg);
      }

      const savedTweet = await res.json();

      const newTweet = {
        id: savedTweet._id,
        name: user.username || "Guest",
        username: `@${user.username}`,
        avatar: user.avatar?.startsWith("/")
          ? `http://localhost:5000${user.avatar.replace(/\\/g, "/")}`
          : user.avatar,
        content: savedTweet.text,
        image: savedTweet.image ? `http://localhost:5000${savedTweet.image}` : null,
        audio: savedTweet.audio ? `http://localhost:5000${savedTweet.audio}` : null,
        likes: savedTweet.likes?.length || 0,
        comments: savedTweet.comments?.length || 0,
        createdAt: new Date(savedTweet.createdAt).toLocaleString(),
      };

      setTweets([newTweet, ...tweets]);
      setContent("");
      setAudioBlob(null);
      setOtpVerified(false);
      setOtpSent(false);
      setOtpInput("");
      setImageFile(null);
      setImagePreview(null);
    } catch (err) {
      console.error("Error posting tweet:", err);
      alert(err);
    }
  };

  useEffect(() => {
    const fetchTweets = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/posts", {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        const data = await res.json();

        const formatted = data.reverse().map(post => ({
          id: post._id,
          name: post.user?.username || "Guest",
          username: `@${post.user?.username || "guest"}`,
          avatar: post.user?.avatar
            ? post.user.avatar.startsWith("/")
              ? `http://localhost:5000${post.user.avatar}`
              : post.user.avatar
            : "https://via.placeholder.com/150",
          content: post.text,
          image: post.image ? `http://localhost:5000${post.image}` : null,
          audio: post.audio ? `http://localhost:5000${post.audio}` : null,
          likes: post.likes || 0,
          comments: post.comments || 0,
          createdAt: new Date(post.createdAt).toLocaleString(),
        }));

        setTweets([...formatted, ...exampleTweets]);
      } catch (err) {
        console.error(err);
        setTweets([...exampleTweets]);
      }
    };
    fetchTweets();
  }, []);

  return (
    <div className="flex flex-col w-[600px] border-x border-gray-700 min-h-screen">
      {/* Header */}
      <div className="sticky top-0 z-10 border-b border-gray-700 bg-black/40 backdrop-blur-md">
        <div className="flex">
          <div className="flex-1 flex justify-center font-medium py-3 cursor-pointer hover:bg-neutral-900 transition-colors">
            For you
          </div>
          <div className="flex-1 flex justify-center font-medium py-3 cursor-pointer hover:bg-neutral-900 transition-colors">
            Following
          </div>
        </div>
      </div>

      {/* Composer */}
      <div className="p-4 flex gap-3 border-b border-gray-700">
        <Avatar
          src={
            user?.avatar
              ? `http://localhost:5000${user.avatar.replace(/\\/g, "/")}`
              : "https://via.placeholder.com/150"
          }
        />

        <div className="flex-1 flex flex-col">
          <textarea
            className="w-full p-2 text-white text-lg bg-transparent resize-none outline-none min-h-[80px]"
            placeholder="What's happening?"
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />

          {imagePreview && (
            <img
              src={imagePreview}
              alt="preview"
              className="w-full max-h-80 rounded-md object-cover mb-2"
            />
          )}

          <div className="flex justify-between items-center mt-2">
            <div className="flex gap-4 text-gray-400">
              <button
                onClick={() => fileInputRef.current.click()}
                className="hover:text-sky-500 transition"
              >
                <ImageIcon />
              </button>

              <input
                type="file"
                accept="image/*"
                ref={fileInputRef}
                onChange={(e) => {
                  const file = e.target.files[0];
                  if (!file) return;
                  setImageFile(file);
                  setImagePreview(URL.createObjectURL(file));
                }}
                className="hidden"
              />

              <button className="hover:text-sky-500 transition"><GifIcon /></button>
              <button className="hover:text-sky-500 transition"><PollIcon /></button>
              <button className="hover:text-sky-500 transition"><EmojiEmotionsIcon /></button>
              <button className="hover:text-sky-500 transition"><ScheduleIcon /></button>
              <button
                className={recording ? "text-red-500" : ""}
                onClick={recording ? stopRecording : startRecording}
              >
                <MicIcon />
              </button>
            </div>

            <button
              onClick={handleTweet}
              disabled={!content.trim() && !audioBlob && !imageFile}
              className={`px-4 py-2 font-bold rounded-full transition-colors ${
                content.trim() || audioBlob || imageFile
                  ? "bg-white text-black hover:bg-gray-200"
                  : "bg-neutral-500 text-black"
              } disabled:opacity-50`}
            >
              Post
            </button>
          </div>

          {audioBlob && <audio controls src={URL.createObjectURL(audioBlob)} className="mt-2" />}

          {audioBlob && !otpSent && (
            <button
              onClick={sendOtp}
              className="mt-2 px-2 py-1 bg-black text-white border-t border-gray-700"
            >
              Send OTP
            </button>
          )}
          {audioBlob && otpSent && !otpVerified && (
            <div className="flex gap-2 mt-2">
              <input
                type="text"
                placeholder="Enter OTP"
                className="px-2 rounded text-white"
                value={otpInput}
                onChange={(e) => setOtpInput(e.target.value)}
              />
              <button
                onClick={verifyOtp}
                className="py-1 px-20 bg-black text-white rounded border border-gray-700"
              >
                Verify OTP
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Feed */}
      {tweets.length === 0 ? (
        <div className="p-6 text-gray-400 text-center">No posts found.</div>
      ) : (
        tweets.map((tweet) => <Tweet key={tweet.id} tweet={tweet} user={user} />)
      )}
    </div>
  );
}
