import React from "react";
import { act } from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import TodaysSleep from "../components/dashboard/TodaysSleep";
import userEvent from "@testing-library/user-event";

describe("TodaysSleep Component", () => {
  it("renders the slider and moon icons inside the popup", () => {
    render(<TodaysSleep />);
    const expandIcon = screen.getByTestId("expand-icon");

    // Open the popup
    fireEvent.click(expandIcon);

    // Verify slider is present
    expect(screen.getByRole("slider")).toBeInTheDocument();

    // Verify moon icons are rendered
    const leftMoonIcon = screen.getByTestId("left-moon-icon");
    const rightMoonIcon = screen.getByTestId("right-moon-icon");
    expect(leftMoonIcon).toBeInTheDocument();
    expect(rightMoonIcon).toBeInTheDocument();
  });

  it("updates sleep hours when slider is adjusted", async () => {
      const expandIcon = screen.getByTestId("expand-icon");
      userEvent.click(expandIcon);

      const sliderThumb = await screen.findByRole("slider");
      expect(sliderThumb).toBeInTheDocument();

      fireEvent.change(sliderThumb, {target: {value: 7}});

      const updatedSleepHoursText = await screen.findByText(/you slept 7 hours last night!/i);
      expect(updatedSleepHoursText).toBeInTheDocument();
  });

  it("renders the icons for the slider", () => {
    render(<TodaysSleep />);
    // expect(screen.getByTestId("BedtimeOutlinedIcon")).toBeInTheDocument();
    expect(screen.getByTestId("NightsStayIcon")).toBeInTheDocument();
  });
});

