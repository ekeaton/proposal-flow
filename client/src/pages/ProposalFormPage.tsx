import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useFieldArray } from "react-hook-form";
import { type ProposalFormValues, proposalFormSchema } from "../lib/schemas";
import { createProposal, updateProposal, getProposal } from "../lib/api";
import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  Paper,
  Alert,
  Grid,
  Divider,
  CircularProgress,
  InputAdornment,
} from "@mui/material";

function ProposalFormPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditMode = Boolean(id);

  const {
    control,
    handleSubmit,
    register,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ProposalFormValues>({
    resolver: zodResolver(proposalFormSchema),
    defaultValues: { lineItems: [{ description: "", quantity: 1, rate: 0 }] },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "lineItems",
  });

  const [submitError, setSubmitError] = useState<string | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);

  useEffect(() => {
    if (!isEditMode || !id) return;

    getProposal(id)
      .then((res) => {
        reset({
          clientCompany: res.proposal.clientCompany,
          clientContactName: res.proposal.clientContactName,
          clientContactEmail: res.proposal.clientContactEmail,
          engagementType: res.proposal.engagementType,
          duration: res.proposal.duration,
          lineItems: res.proposal.proposalLineItems.map((item) => ({
            description: item.description,
            quantity: item.quantity,
            rate: Number(item.rate),
          })),
        });
      })
      .catch(() => {
        setLoadError("Failed to load proposal. Please try again.");
      });
  }, [id, isEditMode, reset]);

  const onSubmit = async (data: ProposalFormValues) => {
    try {
      setSubmitError(null);
      if (isEditMode) {
        await updateProposal(id!, data);
      } else {
        await createProposal(data);
      }
      navigate("/dashboard");
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : "Submit failed");
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        minHeight: "100vh",
        backgroundColor: "background.default",
        padding: { xs: "24px", md: "48px 24px" },
      }}
    >
      <Paper
        sx={{
          padding: { xs: "32px", md: "48px" },
          width: "100%",
          maxWidth: "800px",
          boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)",
        }}
      >
        {/* Header Section */}
        <Box sx={{ marginBottom: "32px" }}>
          <Typography variant="h4" sx={{ marginBottom: "8px" }}>
            {isEditMode ? "Edit Proposal" : "Create Proposal"}
          </Typography>
          <Typography variant="body1" sx={{ color: "text.secondary" }}>
            {isEditMode
              ? "Update the details of your proposal below."
              : "Fill out the information below to generate a new proposal."}
          </Typography>
        </Box>

        {loadError && (
          <Alert
            severity="error"
            sx={{ marginBottom: "24px", borderRadius: "8px" }}
          >
            {loadError}
          </Alert>
        )}

        {submitError && (
          <Alert
            severity="error"
            sx={{ marginBottom: "24px", borderRadius: "8px" }}
          >
            {submitError}
          </Alert>
        )}

        {/* Form Section */}
        <Box
          component="form"
          onSubmit={handleSubmit(onSubmit)}
          noValidate
          sx={{ display: "flex", flexDirection: "column", gap: "32px" }}
        >
          {/* Client Details */}
          <Box sx={{ display: "flex", flexDirection: "column", gap: "20px" }}>
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              Client Details
            </Typography>
            <Grid container spacing={3}>
              <Grid size={{ xs: 12 }}>
                <TextField
                  label="Company Name"
                  placeholder="Acme Corp"
                  fullWidth
                  {...register("clientCompany")}
                  error={!!errors.clientCompany}
                  helperText={errors.clientCompany?.message}
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  label="Contact Name"
                  placeholder="Jane Smith"
                  fullWidth
                  {...register("clientContactName")}
                  error={!!errors.clientContactName}
                  helperText={errors.clientContactName?.message}
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  label="Contact Email"
                  placeholder="jane@acmecorp.com"
                  fullWidth
                  {...register("clientContactEmail")}
                  error={!!errors.clientContactEmail}
                  helperText={errors.clientContactEmail?.message}
                />
              </Grid>
            </Grid>
          </Box>

          <Divider />

          {/* Engagement Details */}
          <Box sx={{ display: "flex", flexDirection: "column", gap: "20px" }}>
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              Engagement Details
            </Typography>
            <Grid container spacing={3}>
              <Grid size={{ xs: 12, sm: 8 }}>
                <TextField
                  label="Engagement Type"
                  placeholder="e.g. Consulting, Development, Audit"
                  fullWidth
                  {...register("engagementType")}
                  error={!!errors.engagementType}
                  helperText={errors.engagementType?.message}
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 4 }}>
                <TextField
                  label="Duration (weeks)"
                  type="number"
                  placeholder="4"
                  fullWidth
                  {...register("duration", { valueAsNumber: true })}
                  error={!!errors.duration}
                  helperText={errors.duration?.message}
                />
              </Grid>
            </Grid>
          </Box>

          <Divider />

          {/* Line Items */}
          <Box sx={{ display: "flex", flexDirection: "column", gap: "20px" }}>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Typography variant="h6" sx={{ fontWeight: 600 }}>
                Line Items
              </Typography>
              <Button
                variant="outlined"
                size="small"
                onClick={() =>
                  append({ description: "", quantity: 1, rate: 0 })
                }
              >
                + Add Line Item
              </Button>
            </Box>

            {fields.map((field, index) => (
              <Paper
                key={field.id}
                variant="outlined"
                sx={{
                  padding: "24px",
                  backgroundColor: "background.default",
                  borderRadius: "8px",
                }}
              >
                <Grid container spacing={2} alignItems="flex-start">
                  <Grid size={{ xs: 12, md: 5 }}>
                    <TextField
                      label="Description"
                      fullWidth
                      {...register(`lineItems.${index}.description`)}
                      error={!!errors.lineItems?.[index]?.description}
                      helperText={
                        errors.lineItems?.[index]?.description?.message
                      }
                    />
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                    <TextField
                      label="Quantity"
                      type="number"
                      fullWidth
                      {...register(`lineItems.${index}.quantity`, {
                        valueAsNumber: true,
                      })}
                      error={!!errors.lineItems?.[index]?.quantity}
                      helperText={errors.lineItems?.[index]?.quantity?.message}
                    />
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                    <TextField
                      label="Rate"
                      type="number"
                      fullWidth
                      {...register(`lineItems.${index}.rate`, {
                        valueAsNumber: true,
                      })}
                      error={!!errors.lineItems?.[index]?.rate}
                      helperText={errors.lineItems?.[index]?.rate?.message}
                      slotProps={{
                        input: {
                          startAdornment: (
                            <InputAdornment position="start">$</InputAdornment>
                          ),
                        },
                      }}
                    />
                  </Grid>
                  <Grid
                    size={{ xs: 12, md: 1 }}
                    sx={{
                      display: "flex",
                      justifyContent: { xs: "flex-start", md: "center" },
                      marginTop: "8px",
                    }}
                  >
                    <Button
                      color="error"
                      onClick={() => remove(index)}
                      disabled={fields.length === 1}
                    >
                      Remove
                    </Button>
                  </Grid>
                </Grid>
              </Paper>
            ))}
          </Box>

          <Divider sx={{ marginTop: "16px" }} />

          {/* Form Actions */}
          <Box
            sx={{
              display: "flex",
              justifyContent: "flex-end",
              gap: "16px",
            }}
          >
            <Button
              variant="text"
              onClick={() => navigate("/dashboard")}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="contained"
              disabled={isSubmitting}
              sx={{ minWidth: "160px" }}
            >
              {isSubmitting ? (
                <CircularProgress size={24} color="inherit" />
              ) : isEditMode ? (
                "Update Proposal"
              ) : (
                "Create Proposal"
              )}
            </Button>
          </Box>
        </Box>
      </Paper>
    </Box>
  );
}

export default ProposalFormPage;
