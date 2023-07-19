import React, { useState, useRef, useEffect } from "react";
import { Avatar } from "@mui/material";
import { PhotoCamera } from "@mui/icons-material";
import axios from "axios";
import { useLocation, useParams } from "react-router-dom";
import { alert } from "devextreme/ui/dialog";

const squareAvatarStyle = {
  width: "200px",
  height: "150px",
  borderRadius: "4px",
  position: "relative",
  cursor: "pointer",
};

const uploadButtonStyle = {
  position: "absolute",
  bottom: "4px",
  right: "4px",
};

function UserAvatar(props) {
  const [avatarSrc, setAvatarSrc] = useState("");
  const fileInputRef = useRef("");
  const [imageName, setImageName] = useState(props.baseObj.ProfilePicUrl);
  const [profilePicUrl, setProfilePicUrl] = useState("");
  const m = new URLSearchParams(useLocation().search).get("m");
  const { id } = useParams();

  const hdr = {
    mId: m,
  };

  useEffect(() => {
    if (imageName) {
      getImageFromServer(imageName);
    }
  }, [imageName]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();

    const allowedTypes = ["image/jpeg", "image/png"];
    if (!allowedTypes.includes(file.type)) {
      alert("Only JPEG and PNG files are allowed.", "Image Format Error");
      return;
    }

    const maxSizeInBytes = 1 * 1024 * 1024;
    if (file.size > maxSizeInBytes) {
      alert("File size exceeds the limit of 1MB", "Image Size Error");
      return;
    }

    reader.onload = (event) => {
      setAvatarSrc(event.target.result);
    };

    if (file) {
      reader.readAsDataURL(file);
      uploadFile(file);
    }
  };

  const handleUploadClick = () => {
    fileInputRef.current.click();
    console.log(fileInputRef, "FileINput");
  };

  const uploadFile = async (file) => {
    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await axios.post(
        "SystemUser/UploadProfilePic",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      props.setBaseObj({ ...props.baseObj, ProfilePicUrl: response.data });
      setImageName(response.data);

      console.log("Upload success:", response.data);
    } catch (error) {
      console.error("Upload error:", error);
    }
  };

  const getImageFromServer = (imageName) => {
    console.log("hello", imageName);
    try {
      axios({
        method: "get",
        url: `SystemUser/getProfilePicture/${imageName}`,
        responseType: "blob",
        headers: hdr,
      }).then((response) => {
        let x = response.data;
        console.log("response data", x);
        const imageUrl = URL.createObjectURL(response.data);
        setProfilePicUrl(imageUrl);
        console.log("new", imageUrl);
      });
    } catch (error) {
      console.log("getImageFromServer error:", error);
    }
  };

  return (
    <div>
      <input
        ref={fileInputRef}
        accept="image/*"
        style={{ display: "none" }}
        type="file"
        onChange={handleFileChange}
      />

      <Avatar
        style={squareAvatarStyle}
        src={
          profilePicUrl ||
          `filerepository/profilepics/${
            props.baseObj.ProfilePicUrl
              ? props.baseObj.ProfilePicUrl
              : avatarSrc
          }`
        }
        alt="Profile"
        onClick={handleUploadClick}
      >
        <div style={uploadButtonStyle}>
          <PhotoCamera sx={{ margin: 1, marginBottom: 1 }} />
        </div>
      </Avatar>
    </div>
  );
}

export default UserAvatar;
