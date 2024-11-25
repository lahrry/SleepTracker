import React from "react";
import { act } from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import TodaysSleep from "../components/dashboard/TodaysSleep";

describe("TodaysSleep Component", () => {
  it("renders the header with the current day", () => {
    const { getByText } = render(<TodaysSleep />);
    const today = new Date().toLocaleDateString("en-US", { weekday: "long" });
    expect(getByText(today)).toBeInTheDocument();
  });

  it("renders the expand icon", () => {
    render(<TodaysSleep />);
    const expandIcon = screen.getByTestId("expand-icon");
    expect(expandIcon).toBeInTheDocument();
  });

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

  it("updates sleep hours when slider is adjusted", () => {
    render(<TodaysSleep />);
    const expandIcon = screen.getByTestId("expand-icon");
    fireEvent.click(expandIcon);

    const slider = screen.getByRole("slider");
    fireEvent.change(slider, { target: { value: 7 } });

    // Verify the updated sleep hours are displayed
    const updatedSleepHoursText = screen.getByText(/you slept 7 hours last night!/i);
    expect(updatedSleepHoursText).toBeInTheDocument();
  });


//   it("renders the slider and default sleep hours", () => {
//     render(<TodaysSleep />);
//     const sliderLabel = screen.getByText(/about how many hours of sleep did you get last night\?/i);
//     expect(sliderLabel).toBeInTheDocument();

//     // const sleepHoursText = screen.getByText(/you slept 6 hours last night!/i);
//     // expect(sleepHoursText).toBeInTheDocument();
//   });

//   it("updates sleep hours when slider is adjusted", () => {
//     render(<TodaysSleep />);
//     const expand = screen.getByTestId("expand-icon")
//     const slider = screen.getByRole("slider");

//     // Simulate changing the slider value
//     fireEvent.change(slider, { target: { value: 7 } });

//     const updatedSleepHoursText = screen.getByText(/you slept 7 hours last night!/i);
//     expect(updatedSleepHoursText).toBeInTheDocument();
//   });

//   // it("renders the icons for the slider", () => {
//   //   render(<TodaysSleep />);
//   //   expect(screen.getByTestId("BedtimeOutlinedIcon")).toBeInTheDocument();
//   //   expect(screen.getByTestId("NightsStayIcon")).toBeInTheDocument();
//   // });
 });
