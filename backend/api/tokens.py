

# class AccountActivationTokenGenerator(PasswordResetTokenGenerator):
#   def _make_hash_value(self, user, timestamp):
#     return (
#       str(user.user_id) + str(timestamp) + str(user.is_active)
#     )

# account_activation_token = AccountActivationTokenGenerator()