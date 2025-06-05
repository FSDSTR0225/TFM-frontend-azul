import React from "react";
import "../style/DailySummary.css";

function DailySummary({ summary }) {
  if (!summary) return null;

  const {
    newFriends = [],
    notificationSummary,
    joinRequestSummary,
    // joinEventRequests = [],
    approvedEvent = [],
    upcomingEvents = [],
  } = summary;

  const summaryIsEmpty =
    !newFriends.length &&
    !approvedEvent.length &&
    !upcomingEvents.length &&
    !notificationSummary?.message &&
    !joinRequestSummary?.message;

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
            {notificationSummary && (
              <div className="notification-summary">
                <h3 className="notification-title">Notificaciones</h3>
                <p>{notificationSummary.message}</p>
              </div>
            )}
            {joinRequestSummary && (
              <div className="join-event-summary">
                <h3 className="join-event-title">Solicitudes a eventos</h3>
                <p>{joinRequestSummary.message}</p>
              </div>
            )}
            {approvedEvent.length > 0 && (
              <div className="approved-summary">
                <h3 className="approved-summary-title">Eventos aprobados</h3>
                <ul>
                  {approvedEvent.map((approved) => (
                    <li key={approved.eventId}>{approved.message}</li>
                  ))}
                </ul>
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
