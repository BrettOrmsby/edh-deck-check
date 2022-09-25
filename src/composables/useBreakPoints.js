import { useMedia } from "./useMedia";
const isXs = useMedia("(max-width: 576px)");
const isSm = useMedia("(max-width: 768px)");
const isMd = useMedia("(max-width: 992px)");
const isLg = useMedia("(min-width: 993px)");
export { isXs, isSm, isMd, isLg };
