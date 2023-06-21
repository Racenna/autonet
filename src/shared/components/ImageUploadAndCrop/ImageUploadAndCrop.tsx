import React, { useRef, useState } from "react";
import { Button, Box, Slider } from "@mui/material";
import AvatarEditor from "react-avatar-editor";

const CropImage = ({
  onSaveCropImage,
  onUploadStart,
}: {
  onSaveCropImage: (url: string) => void;
  onUploadStart?: () => void;
}) => {
  const [image, setImage] = useState("");
  const [imageZoom, setImageZoom] = useState<number>(1);
  const editorRef = useRef<AvatarEditor | null>(null);

  const reset = () => {
    setImage("");
    setImageZoom(1);
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    onUploadStart?.();
    const file = event.target.files?.[0];

    if (file) {
      const reader = new FileReader();

      reader.onload = (e) => {
        setImage(e.target?.result as string);
      };

      reader.readAsDataURL(file);
    }
  };

  const handleSave = () => {
    if (editorRef.current) {
      const canvas =
        editorRef.current.getImageScaledToCanvas() as HTMLCanvasElement;
      const url = canvas.toDataURL();

      onSaveCropImage(url);
      reset();
    }
  };

  return (
    <div>
      <label htmlFor="upload-avatar">
        <Button variant="contained" component="span">
          Upload Avatar
        </Button>
        <input
          id="upload-avatar"
          hidden
          accept="image/*"
          type="file"
          onChange={handleFileChange}
        />
      </label>

      {image && (
        <Box mt={2}>
          <AvatarEditor
            ref={editorRef}
            image={image}
            width={200}
            height={200}
            border={50}
            borderRadius={100}
            color={[255, 255, 255, 0.6]}
            scale={imageZoom}
          />
          <Slider
            value={imageZoom}
            step={0.1}
            min={1}
            max={2}
            onChange={(e, inputValue) =>
              !Array.isArray(inputValue) && setImageZoom(inputValue)
            }
          />
        </Box>
      )}

      {image && (
        <Box mt={2}>
          <Button variant="contained" onClick={handleSave}>
            Save uploaded image
          </Button>
        </Box>
      )}
    </div>
  );
};

export default CropImage;
