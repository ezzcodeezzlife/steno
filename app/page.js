"use client";
import React, { useState, useRef } from "react";
import { CopyToClipboard } from "react-copy-to-clipboard";

export default function Home() {
  const [website, setWebsite] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [decodedText, setDecodedText] = useState(null);
  const [imgSrc, setImgSrc] = useState(null);
  const canvasRef = useRef(null);
  const imgRef = useRef(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    const text = `${website} ${email} ${password}`;
    const binary = textToBinary(text);
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    ctx.canvas.width = binary.length;
    ctx.canvas.height = 1;
    for (let i = 0; i < binary.length; i++) {
      ctx.fillStyle = binary[i] === "1" ? "black" : "white";
      ctx.fillRect(i, 0, 1, 1);
    }
    const imgSrc = canvas.toDataURL("image/png");
    setImgSrc(imgSrc);
    const link = document.createElement("a");
    link.href = imgSrc;
    link.download = `${website}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleUpload = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext("2d");
        ctx.canvas.width = img.width;
        ctx.canvas.height = img.height;
        ctx.drawImage(img, 0, 0, img.width, img.height);
        const imgData = ctx.getImageData(0, 0, img.width, img.height);
        let binary = "";
        for (let i = 0; i < imgData.data.length; i += 4) {
          binary += imgData.data[i] === 0 ? "1" : "0";
        }
        const decoded = binaryToText(binary);
        const [website, email, password] = decoded.split(" ");
        setDecodedText({ website, email, password });
      };
      img.src = event.target.result;
    };
    reader.readAsDataURL(file);
  };

  const textToBinary = (text) => {
    return text
      .split("")
      .map((char) => char.charCodeAt(0).toString(2).padStart(8, "0"))
      .join("");
  };

  const binaryToText = (binary) => {
    return binary
      .match(/.{1,8}/g)
      .map((byte) => String.fromCharCode(parseInt(byte, 2)))
      .join("");
  };

  return (
    <div className="flex flex-row items-center justify-center min-h-screen ">
      <div className="flex flex-col items-center justify-center min-h-screen py-2 bg-blue-200 w-1/2">
        <h2 className="text-2xl font-bold mb-4">Encode</h2>
        <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
          <input
            type="text"
            value={website}
            onChange={(e) => setWebsite(e.target.value)}
            placeholder="Website"
            className="px-4 py-2 border border-gray-300 rounded-md"
          />
          <input
            type="text"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            className="px-4 py-2 border border-gray-300 rounded-md"
          />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            className="px-4 py-2 border border-gray-300 rounded-md"
          />
          <button
            type="submit"
            className="px-4 py-2 bg-blue-500 text-white rounded-md"
          >
            Encode and Download Image
          </button>
        </form>
        <canvas ref={canvasRef} style={{ display: "none" }} />
        <img
          ref={imgRef}
          src={imgSrc}
          style={{
            display: imgSrc ? "block" : "none",
            maxWidth: "100%",
            height: "auto",
          }}
          alt="Encoded text"
          className="mt-4 max-w-lg mx-auto"
        />
      </div>
      <div className="flex flex-col items-center justify-center min-h-screen py-2 bg-green-200 w-1/2">
        <h2 className="text-2xl font-bold mb-4">Decode</h2>
        <input type="file" onChange={handleUpload} className="mt-4" />
        {decodedText && (
          <div className="mt-4 text-center bg-white p-4 rounded-lg shadow-lg">
            <p className="text-lg font-bold">Decoded Results:</p>
            <p className="flex items-center justify-between mt-2">
              <span className="font-bold pr-2">Website:</span>{" "}
              <a
                href={decodedText.website}
                target="_blank"
                rel="noopener noreferrer"
              >
                {decodedText.website}
              </a>{" "}
              <CopyToClipboard text={decodedText.website}>
                <button className="px-2 py-1 bg-blue-500 text-white rounded-md active:bg-violet-700 focus:outline-none focus:ring focus:ring-violet-300">
                  Copy
                </button>
              </CopyToClipboard>
            </p>
            <p className="flex items-center justify-between mt-2">
              <span className="font-bold">Email:</span> {decodedText.email}{" "}
              <CopyToClipboard text={decodedText.email}>
                <button className="px-2 py-1 bg-blue-500 text-white rounded-md active:bg-violet-700 focus:outline-none focus:ring focus:ring-violet-300">
                  Copy
                </button>
              </CopyToClipboard>
            </p>
            <p className="flex items-center justify-between mt-2">
              <span className="font-bold">Password:</span>{" "}
              {decodedText.password}{" "}
              <CopyToClipboard text={decodedText.password}>
                <button className="px-2 py-1 bg-blue-500 text-white rounded-md active:bg-violet-700 focus:outline-none focus:ring focus:ring-violet-300">
                  Copy
                </button>
              </CopyToClipboard>
            </p>
          </div>
        )}
      </div>
    </div>
  );
}