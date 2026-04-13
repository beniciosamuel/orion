import { UserUseCase } from "../../../src/models/User/UserUseCase";
import { UserRepository } from "../../../src/models/User/UserRepository";
import { Context } from "../../../src/services/Context";
import { EmailService } from "../../../src/services/Notifier";

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

describe("UserUseCase.sendEmailByUserId", () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  it("sends email when user exists", async () => {
    const context = {} as Context;
    const fromIdSpy = jest.spyOn(UserRepository, "fromId").mockResolvedValue({
      id: "user-1",
      fullName: "User One",
      email: "user-1@example.com",
      password: "hashed-password",
      scope: "viewer",
      createdAt: new Date(),
      updatedAt: new Date(),
      deletedAt: null,
    });

    const sendEmailMock = jest
      .fn()
      .mockResolvedValue({ id: "email-1", success: true });

    const initializeSpy = jest
      .spyOn(EmailService, "initialize")
      .mockResolvedValue({
        sendEmail: sendEmailMock,
      } as unknown as EmailService);

    const result = await UserUseCase.sendEmailByUserId(
      {
        userId: "user-1",
        subject: "Movie released",
        html: "<p>Movie released</p>",
        text: "Movie released",
      },
      context,
    );

    expect(fromIdSpy).toHaveBeenCalledWith("user-1", context);
    expect(initializeSpy).toHaveBeenCalledTimes(1);
    expect(sendEmailMock).toHaveBeenCalledWith(
      "user-1@example.com",
      "Movie released",
      "<p>Movie released</p>",
      "Movie released",
    );
    expect(result).toEqual({ id: "email-1", success: true });
  });

  it("throws error when user does not exist", async () => {
    const context = {} as Context;
    const fromIdSpy = jest
      .spyOn(UserRepository, "fromId")
      .mockResolvedValue(null);
    const initializeSpy = jest.spyOn(EmailService, "initialize");

    const processPromise = UserUseCase.sendEmailByUserId(
      {
        userId: "missing-user",
        subject: "Movie released",
        html: "<p>Movie released</p>",
      },
      context,
    );

    await expect(processPromise).rejects.toThrow("User not found");
    expect(fromIdSpy).toHaveBeenCalledWith("missing-user", context);
    expect(initializeSpy).not.toHaveBeenCalled();
  });
});
