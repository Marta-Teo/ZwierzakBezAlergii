-- Wyłączenie wymogu potwierdzenia email w lokalnym Supabase
-- To pozwala na instant onboarding (użytkownik może od razu się zalogować po rejestracji)

-- Sprawdź aktualną konfigurację
SELECT * FROM auth.config;

-- Jeśli nie ma rekordu, utwórz go
INSERT INTO auth.config (id, config)
VALUES (
  'global',
  jsonb_build_object(
    'MAILER_AUTOCONFIRM', true,
    'SMS_AUTOCONFIRM', true
  )
)
ON CONFLICT (id) 
DO UPDATE SET 
  config = jsonb_set(
    auth.config.config,
    '{MAILER_AUTOCONFIRM}',
    'true'
  );

