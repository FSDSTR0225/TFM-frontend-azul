import React from "react";
import "./ModalMUI.css";
import { Button, Box, Modal, Fade, Typography, Backdrop } from "@mui/material";
import { PiSealCheckFill } from "react-icons/pi";
import { MdSmsFailed } from "react-icons/md";
import { green, red, indigo } from "@mui/material/colors";

export default function ModalMUI({
  isShowregisterModal,
  setIsShowregisterModal,
  isModalSuccess,
}) {
  const handleClose = () => setIsShowregisterModal(false);

  const greenstyle = {
    border: `2px solid ${green["600"]}`,
  };
  const redstyle = {
    border: `2px solid ${red["600"]}`,
  };
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
          <Box
            className="registerModal__Box"
            sx={isModalSuccess ? greenstyle : redstyle}
          >
            {isModalSuccess ? (
              <PiSealCheckFill className="registerModal__successicon" />
            ) : (
              <MdSmsFailed className="registerModal__failicon" />
            )}
            <Typography className="registerModal__Title" color={indigo["900"]}>
              {isModalSuccess ? "Awesome!" : "Ooops.."}
            </Typography>
            <Typography className="registerModal__text" color={indigo["900"]}>
              {isModalSuccess
                ? " Now your are ready to play our games!"
                : "Register Fail. Please try again Later"}
            </Typography>
            <Typography
              className={isModalSuccess ? "modalFooter" : "modalFooter fail"}
            >
              <Button
                onClick={() => setIsShowregisterModal(false)}
                className={
                  isModalSuccess ? "modalFooter__btn" : "modalFooter__btn fail"
                }
                variant="contained"
              >
                {isModalSuccess ? "Start playing" : "OK try again"}
              </Button>
            </Typography>
          </Box>
        </Fade>
      </Modal>
    </div>
  );
}
