import React, { useEffect, useState } from "react";
import { View } from "react-native";
import AlertPopup from "./AlertPopup";
import { alertService, EVENTS } from "./AlertService";

export default function AlertProvider({ children }) {
  const [queue, setQueue] = useState([]);

  useEffect(() => {
    function onShow(opt) {
      setQueue((q) => [...q, { id: Date.now().toString(), ...opt }]);
    }

    alertService.addListener(EVENTS.SHOW, onShow);
    return () => {
      alertService.removeListener(EVENTS.SHOW, onShow);
    };
  }, []);

  function onHide(id) {
    setQueue((q) => q.filter((it) => it.id !== id));
  }
  const current = queue.length ? queue[0] : null;

  return (
    <View style={{ flex: 1 }}>
      {children}
      {current ? (
        <AlertPopup
          key={current.id}
          title={current.title}
          message={current.message}
          type={current.type}
          duration={current.duration ?? 5000}
          buttonText={current.buttonText}
          onPress={current.onPress}
          onHide={() => onHide(current.id)}
        />
      ) : null}
    </View>
  );
}
