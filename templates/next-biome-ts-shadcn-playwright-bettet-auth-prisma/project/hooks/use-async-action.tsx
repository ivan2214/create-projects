import { useTransition } from "react";
import { toast } from "sonner";

interface UseAsyncActionOptions<T> {
  onSuccess?: (data: T) => void;
  onError?: (error: string) => void;
  onFinish?: () => void;
  successMessage?: string;
  errorMessage?: string;
}

export function useAsyncAction<T>(
  options: UseAsyncActionOptions<T> = {},
) {
  const [isPending, startTransition] = useTransition();

  const handleSubmit = (actionPromise: Promise<T>) => {
    startTransition(() => {
      actionPromise
        .then((data: any) => {
          if (data?.error) {
            options.onError?.(data.error);
            toast.error(
              data.error ?? options.errorMessage ?? "Ocurrió un error",
            );
          } else {
            options.onSuccess?.(data);
            const successMsg = data?.success ?? options.successMessage;
            if (successMsg) toast.success(successMsg);
          }
        })
        .catch((e: unknown) => {
          const message = e instanceof Error ? e.message : String(e);
          console.error(e);
          options.onError?.(message);
          toast.error(options.errorMessage ?? "Ocurrió un error inesperado");
        })
        .finally(() => {
          options.onFinish?.();
        });
    });
  };

  return { isPending, handleSubmit };
}
