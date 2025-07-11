import React from "react";
import "../style/DailySummary.css";

function DailySummary({ summary }) {
  if (!summary) return null;

  const {
    newFriends = [],
    notificationSummary,
    joinRequestSummary,
    approvedEvent = [],
    upcomingEvents = [],
    profileViewSummary,
    tomorrowEventsSummary,
    eventWithFavoriteGame = [],
    pendingFriendRequestsSummary,
  } = summary;

  const summaryIsEmpty =
    !newFriends.length &&
    !approvedEvent.length &&
    !upcomingEvents.length &&
    !notificationSummary?.message &&
    !joinRequestSummary?.message &&
    !profileViewSummary &&
    !tomorrowEventsSummary &&
    !eventWithFavoriteGame.length &&
    !pendingFriendRequestsSummary;

  return (
    <div className="daily-summary-container">
      <div className="daily-content">
        {summaryIsEmpty ? (
          <div className="no-data-wrapper">
            <p className="no-data-message">
              Todo en orden por aquí. No tienes novedades recientes.
            </p>
            <img
              src="../images/zzz.gif"
              alt="Sin actividad"
              className="no-data-gif"
            />
          </div>
        ) : (
          <>
            <h2 className="daily-summary-title">Resumen diario</h2>
            {newFriends.length > 0 && (
              <div className="newfriends-summary">
                <h3 className="newfriends-title">Nuevos amigos</h3>
                <ul className="newfriends-list">
                  {newFriends.map((friend) => (
                    <li key={friend.userId}>{friend.message}</li>
                  ))}
                </ul>
              </div>
            )}
            {profileViewSummary && (
              <div className="profile-view-summary">
                <h3 className="profile-view-title">Visitas a tu perfil</h3>
                <p>{profileViewSummary}</p>
              </div>
            )}
            {notificationSummary && (
              <div className="notification-summary">
                <h3 className="notification-title">Notificaciones</h3>
                <p>{notificationSummary.message}</p>
              </div>
            )}
            {pendingFriendRequestsSummary && (
              <div className="pending-friend-requests-summary">
                <h3 className="friend-request-title">Peticiones de amistad</h3>
                <p>{pendingFriendRequestsSummary}</p>
              </div>
            )}
            {joinRequestSummary?.message && (
              <div className="join-event-summary">
                <h3 className="join-event-title">Solicitudes a eventos</h3>
                <p>{joinRequestSummary.message}</p>
              </div>
            )}
            {approvedEvent.length > 0 && (
              <div className="approved-summary">
                <h3 className="approved-summary-title">Solicitud a eventos</h3>
                <ul>
                  {approvedEvent.map((approved) => (
                    <li key={approved.eventId}>{approved.message}</li>
                  ))}
                </ul>
              </div>
            )}
            {eventWithFavoriteGame.length > 0 && (
              <div className="favorite-game-events-summary">
                <h3 className="favorite-game-title">Eventos relacionados</h3>
                <ul>
                  {eventWithFavoriteGame.map((event) => (
                    <li key={event.eventId}>{event.message}</li>
                  ))}
                </ul>
              </div>
            )}
            {tomorrowEventsSummary && (
              <div className="tomorrow-events-summary">
                <h3 className="tomorrow-events-title">
                  Recordatorio de mañana
                </h3>
                <p>{tomorrowEventsSummary}</p>
              </div>
            )}

            {upcomingEvents.length > 0 && (
              <div className="upcoming-summary">
                <h3 className="upcoming-summary-title">Eventos programados</h3>
                <p>
                  Tienes {upcomingEvents.length} evento
                  {upcomingEvents.length > 1 ? "s" : ""} esta semana
                </p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default DailySummary;
