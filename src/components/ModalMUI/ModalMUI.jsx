import React from "react";
import "./ModalMUI.css";
import Backdrop from "@mui/material/Backdrop";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import Fade from "@mui/material/Fade";
import Typography from "@mui/material/Typography";
import { PiSealCheckFill } from "react-icons/pi";
import { green } from "@mui/material/colors";

export default function ModalMUI({
  isShowregisterModal,
  setIsShowregisterModal,
}) {
  const success = green["800"];
  const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 500,
    bgcolor: green[100],
    border: `2px solid ${green["600"]}`,
    boxShadow: 24,
    p: 4,
  };

  //   const handleOpen = () => setIsShowregisterModal(true);
  const handleClose = () => setIsShowregisterModal(false);

  return (
    <div>
      <Modal
        className="registerModal"
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        open={isShowregisterModal}
        onClose={handleClose}
        closeAfterTransition
        slots={{ backdrop: Backdrop }}
        slotProps={{
          backdrop: {
            timeout: 500,
          },
        }}
      >
        <Fade in={isShowregisterModal}>
          <Box className="registerModal__Box" sx={style}>
            <Typography
              className="registerModal__Title"
              id="transition-modal-title"
              variant="h6"
              component="h2"
              color={success}
            >
              <PiSealCheckFill className="registerModal__icon" /> Awesome!
            </Typography>
            <Typography
              className="registerModal__text"
              id="transition-modal-description"
              sx={{ mt: 2 }}
              color={success}
            >
              Now your are ready to play our games!
            </Typography>
          </Box>
        </Fade>
      </Modal>
    </div>
  );
}
