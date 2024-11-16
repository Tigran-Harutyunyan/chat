export const getCurrentUser = async (ctx, email) => {
  const response = await ctx.db
    .query("users")
    .filter((q) => q.and(q.eq(q.field("email"), email)))
    .first();
  return response?._id;
};
