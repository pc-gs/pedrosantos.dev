"use client";

import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

const formSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters."),
  email: z.string().email("Please enter a valid email address."),
  subject: z.string().min(5, "Subject must be at least 5 characters."),
  message: z.string().min(10, "Message must be at least 10 characters."),
});

type FormValues = z.infer<typeof formSchema>;

export function ContactForm() {
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: { name: "", email: "", subject: "", message: "" },
  });

  async function onSubmit(values: FormValues) {
    setSubmitting(true);
    try {
      const res = await fetch("/api/send-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to send message");
      setDone(true);
      form.reset();
      toast.success("Message sent — I'll get back to you soon.");
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Something went wrong. Please try again.";
      toast.error(message);
    } finally {
      setSubmitting(false);
    }
  }

  if (done) {
    return (
      <div className="border-t border-border pt-8">
        <p className="font-mono text-[10.5px] uppercase tracking-[0.18em] text-brand-text">
          sent
        </p>
        <p className="mt-4 max-w-[52ch] text-[1.0625rem] leading-[1.72] text-muted-foreground">
          Thanks for reaching out. I&apos;ll reply to your email shortly —
          usually within a day or two, and always by hand.
        </p>
        <button
          type="button"
          onClick={() => setDone(false)}
          className="mt-5 border-b border-brand/30 pb-[3px] font-mono text-[10.5px] uppercase tracking-[0.18em] text-brand-text transition-colors hover:border-brand"
        >
          write another →
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-7">
      <div className="grid grid-cols-1 gap-x-8 gap-y-7 sm:grid-cols-2">
        <Field
          label="Name"
          error={form.formState.errors.name?.message}
          {...form.register("name")}
          placeholder="Your name"
        />
        <Field
          label="Email"
          type="email"
          error={form.formState.errors.email?.message}
          {...form.register("email")}
          placeholder="you@company.com"
        />
      </div>

      <Field
        label="Subject"
        error={form.formState.errors.subject?.message}
        {...form.register("subject")}
        placeholder="What is this about?"
      />

      <div>
        <label
          htmlFor="message"
          className="block font-mono text-[10.5px] uppercase tracking-[0.18em] text-muted-foreground"
        >
          Message
        </label>
        <textarea
          id="message"
          rows={6}
          placeholder="Tell me about the role, the project, or what you are building…"
          aria-invalid={form.formState.errors.message ? true : undefined}
          aria-describedby={
            form.formState.errors.message ? "message-error" : undefined
          }
          {...form.register("message")}
          className="mt-2 w-full resize-none border-b border-input bg-transparent py-2 text-[1.0625rem] text-foreground outline-none transition-colors placeholder:text-muted-foreground/50 focus:border-brand"
        />
        {form.formState.errors.message && (
          <p
            id="message-error"
            role="alert"
            className="mt-2 font-mono text-[11px] text-destructive"
          >
            {form.formState.errors.message.message}
          </p>
        )}
      </div>

      <button
        type="submit"
        disabled={submitting}
        className="inline-flex h-11 items-center gap-2 border border-foreground bg-foreground px-5 font-mono text-[11.5px] uppercase tracking-[0.16em] text-background transition-colors hover:bg-background hover:text-foreground disabled:opacity-50"
      >
        {submitting ? (
          <>
            <Loader2 className="h-3.5 w-3.5 animate-spin" aria-hidden />
            sending…
          </>
        ) : (
          <>send message →</>
        )}
      </button>
    </form>
  );
}

function Field({
  label,
  error,
  type = "text",
  name,
  ...props
}: {
  label: string;
  error?: string;
  type?: string;
  name?: string;
} & React.InputHTMLAttributes<HTMLInputElement>) {
  const id = `contact-${name ?? label.toLowerCase()}`;
  const errorId = `${id}-error`;

  return (
    <div>
      <label
        htmlFor={id}
        className="block font-mono text-[10.5px] uppercase tracking-[0.18em] text-muted-foreground"
      >
        {label}
      </label>
      <input
        id={id}
        name={name}
        type={type}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? errorId : undefined}
        className="mt-2 w-full border-b border-input bg-transparent py-2 text-[1.125rem] text-foreground outline-none transition-colors placeholder:text-muted-foreground/50 focus:border-brand"
        {...props}
      />
      {error && (
        <p
          id={errorId}
          role="alert"
          className="mt-2 font-mono text-[11px] text-destructive"
        >
          {error}
        </p>
      )}
    </div>
  );
}
