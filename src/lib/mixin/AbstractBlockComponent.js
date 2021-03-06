import { TweenLite } from 'gsap';
import VueTypes from 'vue-types';
import config from '../config';
import ComponentType from '../enum/ComponentType';
import AbstractComponent from './AbstractComponent';

export default {
  name: 'AbstractBlockComponent',
  extends: AbstractComponent,
  props: {
    data: VueTypes.object.isRequired,
    addToScrollTracker: VueTypes.bool.def(true),
    transitionInThreshold: VueTypes.number.def(0.25),
  },
  data() {
    return {
      inView: false,
      hasEntered: false,
    };
  },
  beforeCreate() {
    this.componentType = ComponentType.BLOCK_COMPONENT;
  },
  methods: {
    handleBlockComponentReady(component) {
      // Bubble up to the parent page
      this.getParentPage().handleBlockComponentReady(component);
    },
    enterView() {
      this.inView = true;
      return this.transitionIn().then(() => this.startLoopingAnimation());
    },
    leaveView() {
      this.inView = false;
      this.stopLoopingAnimation();
    },
    beyondView() {
      if (!this.hasEntered) {
        this.transitionIn();
      }
    },
    addDebugLabel() {
      const debugLabel = document.createElement('div');
      let breadCrumbs = '';
      let parent = this.$parent;
      while (
        parent &&
        parent.componentType === ComponentType.CONTENT_PAGE &&
        config.debug.blockLabel.nestedLabels
      ) {
        breadCrumbs = `${parent.componentId} » ${breadCrumbs}`;
        parent = parent.$parent;
      }
      debugLabel.innerHTML = breadCrumbs + this.componentId;
      TweenLite.set(debugLabel, config.debug.blockLabel.style);
      this.$el.appendChild(debugLabel);
    },
  },
  mounted() {
    if (config.debug.blockLabel.enabled) {
      this.addDebugLabel();
    }
  },
};
