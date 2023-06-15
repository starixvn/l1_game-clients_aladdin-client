import { getSharedContainer } from "db://shared-components/shared/scripts/startup";
import gc from "game-client-base";
import mobx from "mobx";
import Observer from "observer";
import { siteConfigs } from "./site-configs";

export const sharedContainer = getSharedContainer(siteConfigs);

Observer.configure({ default: { mobx, container: gc.buildObserverContainer(sharedContainer) } });
