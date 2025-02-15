jest.unmock("./client.js");
jest.mock("discord.js");
const discord = require("discord.js");
const client = require("./client.js");

const clientTests = {
  "properly formats a single item auction for WTB": {
    userID: 2,
    auctionUser: "Crakle",
    item: "Chestplate of the Constant",
    price: 2000,
    server: "GREEN",
    auctionContents: "WTB - Chestplate of the Constant . 2k.",
    expectedMessage:
      "Crakle is currently buying Chestplate of the Constant for 2000pp on Project 1999 GREEN server.\n" +
      "***WTB - Chestplate of the Constant . 2k.***\n" +
      "To snooze notifications for this watch for the next hour, click 💤. To remove it, click ❌. To ignore auctions by this seller, click 🔕.",
  },
};

// RUN TESTS
for (const testCase in clientTests) {
  const watch_id = clientTests[testCase].watchID;
  const user_id = clientTests[testCase].userID;
  const auction_user = clientTests[testCase].auctionUser;
  const item = clientTests[testCase].item;
  const price = clientTests[testCase].price;
  const server = clientTests[testCase].server;
  const auction_contents = clientTests[testCase].auctionContents;
  const expected_message = clientTests[testCase].expectedMessage;
  const watch_type = clientTests[testCase].watchType; // Added watch_type

  test(testCase, () => {
    client.pingUser(
      bot,
      watch_id,
      user_id,
      auction_user,
      item,
      price,
      server,
      auction_contents,
      watch_type // Added watch_type as an argument
    );

    console.log("Actual message:", discord.Client.prototype.users.cache.get().send.mock.calls[0][0]);
    console.log("Expected message:", expected_message);

    expect(discord.Client.prototype.users.cache.get().send).toBeCalledWith(
      expected_message
    );
  });
}
