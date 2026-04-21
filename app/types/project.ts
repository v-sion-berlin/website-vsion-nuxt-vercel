export type SliderImage = {
  type: "image";
  src: string;
  alt: string;
  title: string;
  aspectRatio?: "16/9" | "1/1";
};

export type SliderVideo = {
  type: "video";
  provider: "vimeo" | "youtube";
  videoId: string;
  title: string;
  poster?: string;
  autoPlay?: boolean;
  aspectRatio?: "16/9" | "1/1";
};

export type SliderItem = SliderImage | SliderVideo;
