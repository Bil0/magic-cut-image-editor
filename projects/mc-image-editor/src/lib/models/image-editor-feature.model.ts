export interface ImageEditorFeature {
  name: string;
  apply(
    context: CanvasRenderingContext2D,
    image: HTMLImageElement,
    ...args: Array<any>
  ): void;
}

export type CustomImageEditorFeature = (
  context: CanvasRenderingContext2D,
  image: HTMLImageElement,
  ...args: Array<any>
) => void;

export interface FeatureContainer {
  [props: string]: ImageEditorFeature;
}
