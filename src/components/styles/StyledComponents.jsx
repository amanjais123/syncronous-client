import { Skeleton, keyframes, styled } from "@mui/material";
import { Link as LinkComponent } from "react-router-dom";

const VisuallyHiddenInput = styled("input")({
  border: 0,
  clip: "rect(0 0 0 0)",
  height: 1,
  margin: -1,
  overflow: "hidden",
  padding: 0,
  position: "absolute",
  whiteSpace: "nowrap",
  width: 1,
});

const Link = styled(LinkComponent)`
  text-decoration: none;
  color: #131b2e;
  display: block;
  &:hover {
    background-color: rgba(70, 72, 212, 0.06);
  }
`;

const InputBox = styled("input")`
  flex: 1;
  border: none;
  background: none;
  outline: none;
  font-family: 'Inter', sans-serif;
  font-size: 0.9375rem;
  color: #131b2e;
  &::placeholder {
    color: #767586;
  }
`;

const SearchField = styled("input")`
  flex: 1;
  border: none;
  background: none;
  outline: none;
  font-family: 'Inter', sans-serif;
  font-size: 0.9375rem;
  color: #131b2e;
  &::placeholder {
    color: #767586;
  }
`;

const CurveButton = styled("button")`
  border-radius: 9999px;
  padding: 0.75rem 1.5rem;
  border: none;
  outline: none;
  cursor: pointer;
  background: linear-gradient(135deg, #4648d4, #6063ee);
  color: white;
  font-family: 'Inter', sans-serif;
  font-size: 0.9375rem;
  font-weight: 600;
  &:hover {
    opacity: 0.9;
  }
`;

const bounceAnimation = keyframes`
  0% { transform: scale(1); }
  50% { transform: scale(1.5); }
  100% { transform: scale(1); }
`;

const BouncingSkeleton = styled(Skeleton)(() => ({
  animation: `${bounceAnimation} 1s infinite`,
}));

export {
  CurveButton,
  SearchField,
  InputBox,
  Link,
  VisuallyHiddenInput,
  BouncingSkeleton,
};