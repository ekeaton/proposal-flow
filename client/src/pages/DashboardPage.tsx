import { useState, useEffect } from "react";
import { ProposalStatus, type Dashboard, type Proposal } from "../lib/types";
import { getDashboard, getProposals } from "../lib/api";
import { useAuth } from "../hooks/useAuth";
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Grid,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import { useNavigate } from "react-router-dom";

function DashboardPage() {
  const navigate = useNavigate();
  const [proposals, setProposals] = useState<Proposal[]>([]);
  const [dashboard, setDashboard] = useState<Dashboard | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const { user, logout } = useAuth();

  const stats = dashboard
    ? [
        {
          label: "Total Proposals",
          value: dashboard.totalProposals,
          format: (v: number) => v.toLocaleString(),
        },
        {
          label: "Pending",
          value: dashboard.statusCounts.pending,
          format: (v: number) => v.toLocaleString(),
        },
        {
          label: "Accepted",
          value: dashboard.statusCounts.accepted,
          format: (v: number) => v.toLocaleString(),
        },
        {
          label: "Total Revenue",
          value: dashboard.totalRevenue,
          format: (v: number) =>
            v.toLocaleString("en-US", { style: "currency", currency: "USD" }),
        },
      ]
    : [];

  useEffect(() => {
    let isMounted = true;

    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        const [proposalsData, dashboardData] = await Promise.all([
          getProposals(),
          getDashboard(),
        ]);

        if (!isMounted) return;

        setProposals(
          proposalsData.proposals.map((p) => ({
            ...p,
            totalAmount: Number(p.totalAmount),
          })),
        );
        setDashboard({
          ...dashboardData,
          totalRevenue: Number(dashboardData.totalRevenue),
          averageValue: Number(dashboardData.averageValue),
        });
      } catch {
        if (!isMounted) return;

        setError("Failed to load dashboard data");
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchData();

    return () => {
      isMounted = false;
    };
  }, []);

  const getStatusStyle = (status: ProposalStatus) => {
    const base = {
      paddingTop: "4px",
      paddingBottom: "4px",
      paddingLeft: "12px",
      paddingRight: "12px",
      borderRadius: "99px",
      fontSize: "12px",
      fontWeight: 700,
      textTransform: "uppercase" as const,
    };

    switch (status) {
      case ProposalStatus.ACCEPTED:
        return { ...base, backgroundColor: "#DCFCE7", color: "#166534" };
      case ProposalStatus.REJECTED:
        return { ...base, backgroundColor: "#FEE2E2", color: "#991B1B" };
      case ProposalStatus.PENDING:
      default:
        return { ...base, backgroundColor: "#FEF9C3", color: "#854D0E" };
    }
  };

  const headerCellSx = {
    fontWeight: 600,
    color: "text.secondary",
    padding: "16px 24px",
  };

  const bodyCellSx = {
    paddingLeft: "24px",
    paddingRight: "24px",
    color: "text.secondary",
    borderBottom: "1px solid",
    borderColor: "divider",
  };

  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  if (error)
    return (
      <Alert severity="error" sx={{ margin: "24px" }}>
        {error}
      </Alert>
    );

  return (
    <Box
      sx={{
        backgroundColor: "background.default",
        minHeight: "100vh",
        padding: "40px",
      }}
    >
      <Box sx={{ maxWidth: "1200px", marginLeft: "auto", marginRight: "auto" }}>
        {/* Header */}
        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", sm: "row" },
            justifyContent: "space-between",
            alignItems: { xs: "flex-start", sm: "center" },
            gap: "16px",
            marginBottom: "32px",
          }}
        >
          <Box>
            <Typography variant="h4">Overview</Typography>
            <Typography variant="body1" sx={{ color: "text.secondary" }}>
              Welcome back{" "}
              <span style={{ fontWeight: 800, color: "#111827" }}>
                {user?.name}
              </span>
              ! Here is what's happening with your proposals today.
            </Typography>
          </Box>
          <Box sx={{ display: "flex", gap: "12px" }}>
            <Button
              variant="outlined"
              onClick={() => {
                logout();
                navigate("/login");
              }}
              sx={{
                padding: "10px 24px",
                borderRadius: "8px",
                textTransform: "none",
                fontWeight: 600,
              }}
            >
              Logout
            </Button>
            <Button
              variant="contained"
              onClick={() => navigate("/proposals/new")}
              sx={{
                padding: "10px 24px",
                borderRadius: "8px",
                textTransform: "none",
                fontWeight: 600,
                boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
              }}
            >
              New Proposal
            </Button>
          </Box>
        </Box>

        {/* Stats Grid */}
        <Grid container spacing={3} sx={{ marginBottom: "40px" }}>
          {stats.map((stat) => (
            <Grid size={{ xs: 12, sm: 6, md: 3 }} key={stat.label}>
              <Paper sx={{ padding: "24px" }}>
                <Typography
                  variant="body2"
                  sx={{ color: "text.secondary", fontWeight: 500, marginBottom: "8px" }}
                >
                  {stat.label}
                </Typography>
                <Typography variant="h4">{stat.format(stat.value)}</Typography>
              </Paper>
            </Grid>
          ))}
        </Grid>

        {/* Proposals Table */}
        <Typography variant="h6" sx={{ marginBottom: "16px" }}>
          Recent Proposals
        </Typography>
        <TableContainer component={Paper} sx={{ overflow: "hidden" }}>
          <Table>
            <TableHead sx={{ backgroundColor: "background.default" }}>
              <TableRow>
                <TableCell sx={headerCellSx}>Company</TableCell>
                <TableCell sx={headerCellSx}>Contact</TableCell>
                <TableCell sx={headerCellSx}>Type</TableCell>
                <TableCell sx={headerCellSx}>Duration (Weeks)</TableCell>
                <TableCell sx={headerCellSx}>Status</TableCell>
                <TableCell sx={{ ...headerCellSx, textAlign: "right" }}>
                  Amount
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {proposals.length === 0 && (
                <TableRow>
                  <TableCell
                    colSpan={6}
                    sx={{ textAlign: "center", padding: "48px", color: "text.secondary" }}
                  >
                    No proposals yet. Create your first one to get started.
                  </TableCell>
                </TableRow>
              )}
              {proposals.map((proposal) => (
                <TableRow
                  key={proposal.id}
                  hover
                  onClick={() => navigate(`/proposals/${proposal.id}/edit`)}
                  sx={{ cursor: "pointer" }}
                >
                  <TableCell
                    sx={{
                      ...bodyCellSx,
                      paddingTop: "20px",
                      paddingBottom: "20px",
                      fontWeight: 500,
                      color: "text.primary",
                    }}
                  >
                    {proposal.clientCompany}
                  </TableCell>
                  <TableCell sx={bodyCellSx}>
                    {proposal.clientContactName}
                  </TableCell>
                  <TableCell sx={bodyCellSx}>
                    {proposal.engagementType}
                  </TableCell>
                  <TableCell sx={bodyCellSx}>{proposal.duration}</TableCell>
                  <TableCell sx={bodyCellSx}>
                    <span style={getStatusStyle(proposal.status)}>
                      {proposal.status}
                    </span>
                  </TableCell>
                  <TableCell
                    sx={{
                      ...bodyCellSx,
                      textAlign: "right",
                      fontWeight: 700,
                      color: "text.primary",
                    }}
                  >
                    {proposal.totalAmount.toLocaleString("en-US", {
                      style: "currency",
                      currency: "USD",
                    })}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    </Box>
  );
}

export default DashboardPage;
