/* eslint-disable no-underscore-dangle */
import { EntityLifeStage, EntityType, EntityVisualState, MouseEventsNames } from "@constants/enum.constants";
import { Box, Circle, Rect, Shape } from "@svgdotjs/svg.js";
import { EntityAttributes, EntityEventContext, EntityEventsFunctions } from "@types";

// const hoverOrSelectColor = "#38e8e8";
const hoverOrSelectColor = "#9bf3f3";
// const hoverColor = "#bb00b1";
const hoverColor = "#cc68e8";
const mergeColor = "#69f0ae";
const hoverOpacity = 0.4;
const animationDuration = 180;

export abstract class Entity {
    abstract attributes: EntityAttributes;

    protected abstract hoverOrSelectShape: Rect | Circle | undefined;

    protected lifeStage: EntityLifeStage;

    protected bbox: Box | undefined;

    protected _visualState!: EntityVisualState;

    public get visualState(): EntityVisualState {
        return this._visualState;
    }

    private set visualState(value: EntityVisualState) {
        this._visualState = value;
    }

    constructor() {
        this.lifeStage = EntityLifeStage.New;
        this.visualState = EntityVisualState.None;
    }

    isAlive() {
        return this.lifeStage === EntityLifeStage.Initialized;
    }

    protected abstract setHoverOrSelectShape(): void;

    // implement
    protected abstract modifyTree(add: boolean): void;

    // implement
    protected addInstanceToMap(): void {}

    // implement
    protected removeInstanceFromMapAndTree(): void {}

    protected undraw(): void {}

    // ! should be private
    abstract draw(): void;

    abstract execOuterDrawCommand(): void;

    abstract myType: EntityType;

    abstract getKekuleNode(): any;

    abstract updateKekuleNode(): void;

    updateBbox(shape: Shape) {
        this.bbox = shape.bbox();
    }

    setVisualState(visualState: EntityVisualState, color: string = hoverOrSelectColor) {
        if (!this.hoverOrSelectShape) return;

        let tempVisualState = visualState;
        this.hoverOrSelectShape.timeline().finish();

        switch (visualState) {
            case EntityVisualState.None:
                this.hoverOrSelectShape.fill({ opacity: 0 });
                break;
            case EntityVisualState.Hover:
                // this.hoverOrSelectShape.fill({ color, opacity: hoverOpacity });
                this.hoverOrSelectShape.fill({ color: hoverColor, opacity: hoverOpacity });
                break;
            case EntityVisualState.Select:
                this.hoverOrSelectShape.fill({ color, opacity: 1 });
                break;
            case EntityVisualState.AnimatedClick: {
                // eslint-disable-next-line no-param-reassign
                tempVisualState = this.visualState;
                const currentColor = this.hoverOrSelectShape.fill();
                const currentOpacity = this.hoverOrSelectShape.attr("fill-opacity") ?? 1;
                this.hoverOrSelectShape
                    .animate({
                        duration: animationDuration,
                        delay: 0,
                        when: "now",
                        swing: false,
                        times: 1,
                        wait: 0,
                    })
                    .attr({ fill: color, "fill-opacity": 1 })
                    .animate(animationDuration, animationDuration, "now")
                    .attr({ fill: currentColor, "fill-opacity": currentOpacity });
                break;
            }
            case EntityVisualState.Merge:
                this.hoverOrSelectShape.fill({ color: mergeColor, opacity: 1 });
                break;
            default:
                break;
        }

        this.visualState = tempVisualState;
    }

    setListeners(eventListeners?: EntityEventsFunctions) {
        this.removeListeners();
        if (!this.hoverOrSelectShape || !eventListeners) return;

        const context: EntityEventContext = {
            id: this.getId(),
            type: this.myType,
        };

        if (eventListeners.onMouseDown) {
            const handler = eventListeners.onMouseDown;
            this.hoverOrSelectShape.on(MouseEventsNames.onMouseDown, (event) => handler(event, context));
        }
        if (eventListeners.onMouseEnter) {
            const handler = eventListeners.onMouseEnter;
            this.hoverOrSelectShape.on(MouseEventsNames.onMouseEnter, (event) => handler(event, context));
            // this.hoverOrSelectShape.on(MouseEventsNames.onMouseEnter, (event) =>
            //     console.log("onMouseEnter on Entity=", this.getId())
            // );
        }
        if (eventListeners.onMouseLeave) {
            const handler = eventListeners.onMouseLeave;
            this.hoverOrSelectShape.on(MouseEventsNames.onMouseLeave, (event) => handler(event, context));
            // this.hoverOrSelectShape.on(MouseEventsNames.onMouseLeave, (event) =>
            //     console.log("onMouseLeave on Entity=", this.getId())
            // );
        }
        if (eventListeners.onMouseMove) {
            const handler = eventListeners.onMouseMove;
            this.hoverOrSelectShape.on(MouseEventsNames.onMouseMove, (event) => handler(event, context));
        }
        if (eventListeners.onMouseUp) {
            const handler = eventListeners.onMouseUp;
            this.hoverOrSelectShape.on(MouseEventsNames.onMouseUp, (event) => handler(event, context));
        }
        // Object.keys(MouseEventsNames).forEach((eventName) => {

        //     const f = eventListeners[eventName];
        //     if (!eventListeners[eventName]) return;
        //     this.hoverOrSelectShape.on(eventName, (e) => {
        //         eventListeners[eventName](e, this);
        //     });
        // });
    }

    removeListeners() {
        if (!this.hoverOrSelectShape) return;
        this.hoverOrSelectShape.off();
    }

    getLifeStage() {
        return this.lifeStage;
    }

    getId() {
        return this.attributes.id;
    }

    // updateAttributes(newAttributes: Partial<AtomAttributes>, ignoreNotifyBondsIds: number[] = []);

    // destroy(ignoreBondRemove: number[] = [], IShouldNotifyBonds: boolean = true);
}
