import App from './App.html';
import { createStateMachine, makeWebComponentFromFsm } from "state-transducer";
import emitonoff from "emitonoff";
import { commandHandlers, effectHandlers, movieSearchFsmDef } from "./fsm";
import { COMMAND_RENDER, events } from "./properties";
import {getEventEmitterAdapter} from "./helpers"

let app = void 0;

const fsm = createStateMachine(movieSearchFsmDef, {
  debug: { console }
});

function subjectFromEventEmitterFactory() {
  const eventEmitter = emitonoff();
  const DUMMY_NAME_SPACE = "_";
  const _ = DUMMY_NAME_SPACE;
  const subscribers = [];

  return {
    next: x => eventEmitter.emit(_, x),
    complete: () => subscribers.forEach(f => eventEmitter.off(_, f)),
    subscribe: f => (subscribers.push(f), eventEmitter.on(_, f))
  };
}

const svelteRenderCommandHandler = {
  [COMMAND_RENDER]: (next, params, effectHandlers, el) => {
    const { screen, query, results, title, details, cast  } = params;
    const props = Object.assign({}, params, {next})

    if (!app) {
      app = new App({
        target: el,
        data: props
      });
    }
    else {
      app.set(props);
    }
  }
};
const commandHandlersWithRender = Object.assign({}, commandHandlers, svelteRenderCommandHandler);

const options = { initialEvent: { [events.USER_NAVIGATED_TO_APP]: void 0 } };

makeWebComponentFromFsm({
  name: "movie-search",
  eventHandler: getEventEmitterAdapter(emitonoff),
  fsm,
  commandHandlers: commandHandlersWithRender,
  effectHandlers,
  options
});

const movieSearch = document.createElement("movie-search");
document.getElementById("root").appendChild(movieSearch);
