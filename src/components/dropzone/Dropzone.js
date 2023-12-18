import React, { useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { Box, CardMedia, IconButton } from "@mui/material";
import { useDispatch } from "react-redux";
import Iconify from "../Iconify";

// redux

const MyDropzone = ({
  images,
  setImages,
  imagesToDelete,
  setImagesToDelete,
  maxFile = 0,
}) => {
  const dispatch = useDispatch();
  // const [imageFiles, setImageFiles] = useState([]);
  // const { images } = useSelector((store) => store.post);

  const onDrop = useCallback(
    async (accFiles, rejFiles) => {
      const mappedAcc = accFiles.map((file) => ({
        fileId: 0,
        file,
        imageUrl: URL.createObjectURL(file),
      }));
      const mappedRej = rejFiles.map((r) => ({ ...r }));
      //@ts-ignore
      // setImageFiles([...imageFiles, ...mappedAcc, ...mappedRej]);
      await dispatch(setImages([...images, ...mappedAcc, ...mappedRej]));
    },
    [dispatch, images, setImages]
  );

  const onDelete = (fileWrapper) => {
    if (fileWrapper.fileId !== 0) {
      dispatch(setImagesToDelete([...imagesToDelete, fileWrapper.fileId]));
    }
    dispatch(setImages(images.filter((fw) => fw.file !== fileWrapper.file)));
  };

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: { "image/*": [".jpeg", ".jpg", ".png"] },
    maxSize: 5000 * 1024, //5mb
  });

  return (
    <>
      <Box>
        <div
          {...getRootProps()}
          // eslint-disable-next-line eqeqeq
          style={{ pointerEvents: (images.length >= maxFile && maxFile != 0) ? "none" : "auto" }}
        >
          <div>
            <label
              onClick={(e) => {
                e.stopPropagation();
              }}
              htmlFor="dropzone-file"
              style={{
                height: 200,
                width: 100,
              }}
            >
              <div
                style={{
                  border: `2px solid #202020`,
                  padding: 10,
                  borderRadius: 10,
                  borderStyle: "dashed",
                }}
              >
                <svg
                  aria-hidden="true"
                  style={{ height: 50, width: 50 }}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                  ></path>
                </svg>
                <p className="mb-2 text-lg text-gray-800 dark:text-gray-400 mobile:text-[14px]">
                  Drag and drop files or{" "}
                  <span className="font-semibold text-joltpay-blue-bg underline mobile:text-[14px]">
                    Browse
                  </span>
                </p>
                <p className="text-md text-gray-500 dark:text-gray-400 mobile:text-[12px]">
                  Supported formats: JPEG, PNG
                </p>
              </div>
              <input
                id="dropzone-file"
                // type="file"
                className="hidden"
                // eslint-disable-next-line eqeqeq
                {...getInputProps()}
              />
            </label>
          </div>
        </div>

        {images.map((fileWrapper, index) => {
          return (
            <div key={index}>
              <div
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  borderRadius: 2,
                  position: "relative",
                }}
              >
                {/* <img
                  src={fileWrapper.imageUrl}
                  style={{ height: 100, width: "100%", display: 'table-footer-group' }}
                /> */}
                <CardMedia
                  component="img"
                  height="250"
                  image={fileWrapper.imageUrl}
                  alt="Paella dish"
                  sx={{
                    objectFit: "contain",
                    marginTop: 1,
                    borderRadius: 2,
                    backgroundColor: "#202020",
                  }}
                />
                <div
                  style={{
                    position: "absolute",
                    right: 2,
                    top: 2,
                    justifyContent: "center",
                    alignItems: "center",
                    display: "flex",
                  }}
                >
                  <IconButton onClick={() => onDelete(fileWrapper)}>
                    <Iconify
                      icon="carbon:close-filled"
                      sx={{ color: "#A0A0A0" }}
                      width={30}
                      height={30}
                    />
                  </IconButton>
                </div>
                {/* <div>
                  <FileHeader fileData={fileWrapper} onDelete={onDelete} />
                </div> */}
              </div>
            </div>
          );
        })}
      </Box>
    </>
  );
};

export default MyDropzone;
