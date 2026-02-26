import { Button } from "@mui/material";
import { API_BASE_URL } from "../../../../shared/config/env";

export function NaverLoginButton() {
  const handleClick = () => {
    window.location.href = `${API_BASE_URL}/auth/naver`;
  };

  return (
    <Button
      variant="contained"
      fullWidth
      onClick={handleClick}
      sx={{
        py: 1.4,
        borderRadius: "12px",
        fontWeight: 700,
        backgroundColor: "#03c75a",
        color: "#ffffff",
        textTransform: "none",
        "&:hover": { backgroundColor: "#02b351" },
      }}
    >
      네이버로 로그인
    </Button>
  );
}
