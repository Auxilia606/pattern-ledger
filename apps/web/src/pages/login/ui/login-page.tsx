import { Box, Paper, Stack, Typography } from "@mui/material";
import { NaverLoginButton } from "../../../features/auth";

export function LoginPage() {
  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        px: 2,
        background: "linear-gradient(145deg, #f7fff9 0%, #ecf6ff 100%)",
      }}
    >
      <Paper
        elevation={0}
        sx={{
          width: "100%",
          maxWidth: 420,
          p: 4,
          borderRadius: "20px",
          border: "1px solid #e7edf4",
          boxShadow: "0 10px 28px rgba(11, 31, 53, 0.08)",
        }}
      >
        <Stack spacing={2.5}>
          <Typography variant="h4" fontWeight={800}>
            Pattern Ledger
          </Typography>
          <Typography variant="body1" color="text.secondary">
            네이버 계정으로 로그인하고 가계부를 시작하세요.
          </Typography>
          <NaverLoginButton />
        </Stack>
      </Paper>
    </Box>
  );
}
