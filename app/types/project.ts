export type SliderImage = {
  type: "image";
  src: string;
  alt: string;
  title: string;
};

export type SliderVideo = {
  type: "video";
  provider: "vimeo" | "youtube";
  videoId: string;
  title: string;
  poster?: string;
  autoPlay?: boolean;
};

export type SliderItem = SliderImage | SliderVideo;
