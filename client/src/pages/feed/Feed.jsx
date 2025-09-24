import { useState, useEffect, useRef } from "react";
import Tweet from "./Tweet";
import { Avatar } from "@mui/material";
import ImageIcon from "@mui/icons-material/Image";
import GifIcon from "@mui/icons-material/Gif";
import PollIcon from "@mui/icons-material/Poll";
import EmojiEmotionsIcon from "@mui/icons-material/EmojiEmotions";
import ScheduleIcon from "@mui/icons-material/Schedule";
import MicIcon from "@mui/icons-material/Mic";

export default function Feed({ userEmail,user }) {
  const [tweets, setTweets] = useState([]);
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(true);
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

  useEffect(() => {
    const fetchRedditPosts = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/reddit");
        const data = await res.json();

        const mappedTweets = data.data.children
          .map((post) => {
            const p = post.data;
            let image = null;

            if (p.preview?.images?.length > 0) {
              image = p.preview.images[0].source.url.replace(/&amp;/g, "&");
            } else if (p.thumbnail && p.thumbnail.startsWith("http")) {
              image = p.thumbnail;
            }

            return {
              id: p.id,
              username: p.author,
              content: p.title,
              image,
              likes: p.ups,
              comments: p.num_comments,
              createdAt: new Date(p.created_utc * 1000).toLocaleString(),
            };
          })
          .filter((t) => t.image !== null);

        setTweets(mappedTweets);
      } catch (err) {
        console.error("Error fetching Reddit:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchRedditPosts();
  }, []);

  // Helper: Check IST time 2PM - 7PM
  const checkTime = () => {
    const now = new Date();
    const utc = now.getTime() + now.getTimezoneOffset() * 60000;
    const istOffset = 5.5 * 60 * 60000; // 5:30
    const ist = new Date(utc + istOffset);
    const hour = ist.getHours();
    return hour >= 14 && hour <= 23;
  };

  // Audio recording handlers
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

    // Max 5 mins
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

  // Post tweet
  const handleTweet = () => {
    if (!content.trim() && !audioBlob) return;
    if (audioBlob && !otpVerified) return alert("Verify OTP before posting audio");

    const newTweet = {
      id: tweets.length + 1,
      username: user.username,
      content,
      image: imagePreview,
      audio: audioBlob ? URL.createObjectURL(audioBlob) : null,
      likes: 0,
      comments: 0,
      createdAt: new Date().toLocaleString(),
      

    };

    setTweets([newTweet, ...tweets]);
    setContent("");
    setAudioBlob(null);
    setOtpVerified(false);
    setOtpSent(false);
    setOtpInput("");
    setImageFile(null);
setImagePreview(null);
  };

  if (loading) {
    return <div className="text-white p-6 text-center">Loading posts...</div>;
  }

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
  <Avatar src="https://cdn-icons-png.flaticon.com/512/149/149071.png" />

  <div className="flex-1 flex flex-col">
    {/* Textarea first */}
    <textarea
      className="w-full p-2 text-white text-lg bg-transparent resize-none outline-none min-h-[80px]"
      placeholder="What's happening?"
      value={content}
      onChange={(e) => setContent(e.target.value)}
    />

    {/* Image preview below textarea */}
    {imagePreview && (
      <img
        src={imagePreview}
        alt="preview"
        className="w-full max-h-80 rounded-md object-cover mb-2 "
      />
    )}

    {/* Action buttons */}
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

    {/* Audio Preview */}
    {audioBlob && <audio controls src={URL.createObjectURL(audioBlob)} className="mt-2" />}

    {/* OTP */}
    {audioBlob && !otpSent && (
      <button onClick={sendOtp} className="mt-2 px-2 py-1 bg-black text-white border-t border-gray-700">
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
        <button onClick={verifyOtp} className="py-1 px-20 bg-black text-white rounded border border-gray-700">
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
        tweets.map((tweet) => <Tweet key={tweet.id} tweet={tweet}  user={{ username: "currentUser" }} />)
      )}
    </div>
  );
}
