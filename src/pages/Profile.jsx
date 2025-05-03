import React, { useContext } from "react";
import blankImg from "/images/profile/blankImg.jpg";
import "../style/Profile.css";
import { Button } from "@mui/material";
import { IoAddCircleOutline } from "react-icons/io5";
import { MdOutlineEdit } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import AuthContext from "../context/AuthenticationContext";

import "swiper/css";
import ProfileSwiper from "../components/ProfileSwiper/ProfileSwiper";

export default function Profile() {
  const navigate = useNavigate();
  const authContext = useContext(AuthContext);

  return (
    <div className="profile">
      <div className="profile__container">
        <div className="profile__left">
          <div className="profile__left__imgContainer">
            <img className="profileImage" src={blankImg} />
            <div>
              <MdOutlineEdit className="profileImage__editIcon" />
            </div>
            <div className="profileName">{authContext.userInfos.username}</div>
          </div>
          <div className="profile__left__btnContainer">
            <Button
              variant="contained"
              className="profileBtn"
              value="Change Password"
            >
              Change Password
            </Button>
            <Button
              variant="contained"
              className="profileBtn"
              value="Logout"
              onClick={() => {
                authContext.logout();
                navigate("/");
              }}
            >
              Log out
            </Button>
          </div>
        </div>
        <div className="profile__right">
          <div className="profile__right__mainContainer">
            <div className="profile__mainContainerItem">
              <div className="profileDetail">
                <span className="detailTitle">Username:</span>
                <span className="detailText">
                  {authContext.userInfos.username}
                </span>
              </div>
              <div className="profileDetail">
                <span className="detailTitle">Friends:</span>
                <span className="detailText">8</span>
              </div>
              <div className="profileDetail">
                <span className="detailTitle">Favorit Games:</span>
                <span className="detailText">12</span>
              </div>
            </div>
            <div className="profile__mainContainerItem">
              <div className="profileDetail">
                <span className="detailTitle">Email:</span>
                <span className="detailText">
                  {authContext.userInfos.email}
                </span>
              </div>
              <div className="profileDetail">
                <span className="detailTitle">Rating:</span>
                <span className="detailText">8.2</span>
              </div>
            </div>
          </div>
          <div className="profile__right__lowContainer">
            <div className="profile__right__favoriteGames__wrapper">
              <div className="profile__right__favoriteGames">
                <span className="profile__right__title">Favorite Games:</span>
                <ProfileSwiper
                  spaceBetween={10}
                  slidesPerView={7}
                  delay={1500}
                  swiperArray={[
                    { id: 1, title: "Call of duty", img: blankImg },
                    { id: 2, title: "Ajedrez", img: blankImg },
                    { id: 3, title: "Stronghold", img: blankImg },
                    { id: 4, title: "Age of empires", img: blankImg },
                    { id: 5, title: "Fifa 2025", img: blankImg },
                    { id: 6, title: "Assasin creed", img: blankImg },
                    { id: 7, title: "Knight of night", img: blankImg },
                    { id: 8, title: "Mortal combat", img: blankImg },
                    { id: 9, title: "Prince of persia", img: blankImg },
                    { id: 10, title: "Super Mario", img: blankImg },
                    { id: 11, title: "Aladin 9", img: blankImg },
                    { id: 12, title: "Age of kings", img: blankImg },
                  ]}
                />
              </div>
              <Button
                variant="contained"
                className="profile__right__btn"
                value="new game"
              >
                <IoAddCircleOutline className="addIcon" />
                new game
              </Button>
            </div>

            <div className="profile__right__friends__wrapper">
              <div className="profile__right__friends">
                <span className="profile__right__title"> Friends:</span>
                <ProfileSwiper
                  spaceBetween={30}
                  slidesPerView={5}
                  delay={2500}
                  swiperArray={[
                    { id: 1, title: "Giu Eminente", img: blankImg },
                    { id: 2, title: "Lidia Ramos", img: blankImg },
                    { id: 3, title: "Salva Gorlat", img: blankImg },
                    { id: 4, title: "Toomaj Bandad", img: blankImg },
                    { id: 5, title: "Adrian Fernandez", img: blankImg },
                    { id: 6, title: "Jordi Galobart", img: blankImg },
                    { id: 7, title: "Pedro Alistin", img: blankImg },
                    { id: 8, title: "Camelia Rodriguez", img: blankImg },
                  ]}
                />
              </div>
              <Button
                variant="contained"
                className="profile__right__btn"
                value="new friend"
              >
                <IoAddCircleOutline className="addIcon" />
                new friend
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
