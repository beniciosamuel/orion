import { UserUseCase } from "../../../src/models/User/UserUseCase";
import { UserRepository } from "../../../src/models/User/UserRepository";
import { Context } from "../../../src/services/Context";

describe("UserUseCase.updateTheme", () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  it("updates theme when user settings exist", async () => {
    const context = {} as Context;
    const settingsFromUserIdSpy = jest
      .spyOn(UserRepository, "settingsFromUserId")
      .mockResolvedValue({
        user_id: "user-1",
        language: "pt",
        theme: "dark",
        timezone: "America/Sao_Paulo",
        notify: true,
        created_at: new Date(),
        updated_at: new Date(),
      });
    const updateThemeSpy = jest
      .spyOn(UserRepository, "updateTheme")
      .mockResolvedValue(true);

    const result = await UserUseCase.updateTheme(
      {
        userId: "user-1",
        theme: "light",
      },
      context,
    );

    expect(settingsFromUserIdSpy).toHaveBeenCalledWith("user-1", context);
    expect(updateThemeSpy).toHaveBeenCalledWith(
      { userId: "user-1", theme: "light" },
      context,
    );
    expect(result).toBe(true);
  });

  it("throws error when user settings do not exist", async () => {
    const context = {} as Context;
    const settingsFromUserIdSpy = jest
      .spyOn(UserRepository, "settingsFromUserId")
      .mockResolvedValue(null);
    const updateThemeSpy = jest.spyOn(UserRepository, "updateTheme");

    const processPromise = UserUseCase.updateTheme(
      {
        userId: "missing-user",
        theme: "dark",
      },
      context,
    );

    await expect(processPromise).rejects.toThrow("User settings not found");
    expect(settingsFromUserIdSpy).toHaveBeenCalledWith("missing-user", context);
    expect(updateThemeSpy).not.toHaveBeenCalled();
  });
});
