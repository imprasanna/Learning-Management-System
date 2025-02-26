import { useSnackbar } from "notistack";

export default function useSnackbarController() {
    const { enqueueSnackbar } = useSnackbar();

    function showErrorSnackbar(message) {
        return enqueueSnackbar(message, {
            variant: "error",
            anchorOrigin: { vertical: "top", horizontal: "right" },
        });
    }
    
    function showInfoSnackbar(message) {
        return enqueueSnackbar(message, {
            variant: "info",
            anchorOrigin: { vertical: "top", horizontal: "right" },
        });
    }

    function showWarningSnackbar(message) {
        return enqueueSnackbar(message, {
            variant: "warning",
            anchorOrigin: { vertical: "top", horizontal: "right" },
        });
    }

    function showSuccessSnackbar(message) {
        return enqueueSnackbar(message, {
            variant: "success",
            anchorOrigin: { vertical: "top", horizontal: "right" },
        });
    }

    return {
        showErrorSnackbar,
        showInfoSnackbar,
        showSuccessSnackbar,
        showWarningSnackbar
    }
}