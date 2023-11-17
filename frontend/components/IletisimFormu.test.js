import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import userEvent from "@testing-library/user-event";
import IletisimFormu from "./IletisimFormu";
import App from "../App";
import { fireEvent } from "@testing-library/react";
import { expect, jest, test } from "@jest/globals";

test("hata olmadan render ediliyor", () => {
  render(<App />);
});

test("iletişim formu headerı render ediliyor", () => {
  render(<App />);
  const header = screen.getByTestId("iletişim-header");
  expect(header).toHaveTextContent("İletişim Formu");
});

test("kullanıcı adını 5 karakterden az girdiğinde BİR hata mesajı render ediyor.", async () => {
  render(<App />);
  const name = screen.getByTestId("name-input");
  fireEvent.change(name, { target: { value: "lore" } });
  const error = screen.getByTestId("error");
  expect(error).toHaveTextContent("Hata: ad en az 5 karakter olmalıdır.");
});

test("kullanıcı inputları doldurmadığında ÜÇ hata mesajı render ediliyor.", async () => {
  render(<App />);
  const submitBtn = screen.getByTestId("submit-btn");
  expect(submitBtn).toHaveTextContent("Gönder");
  fireEvent.click(submitBtn);
  const errors = screen.getAllByTestId("error");
  expect(errors).toHaveLength(3);
});

test("kullanıcı doğru ad ve soyad girdiğinde ama email girmediğinde BİR hata mesajı render ediliyor.", async () => {
  render(<App />);
  const name = screen.getByTestId("name-input");
  fireEvent.change(name, { target: { value: "Hamza" } });

  const surname = screen.getByTestId("surname-input");
  fireEvent.change(surname, { target: { value: "Sahin" } });

  const submitBtn = screen.getByTestId("submit-btn");
  fireEvent.click(submitBtn);

  const error = screen.getByTestId("error");
  expect(error).toHaveTextContent(
    "Hata: email geçerli bir email adresi olmalıdır."
  );
});

test('geçersiz bir mail girildiğinde "email geçerli bir email adresi olmalıdır." hata mesajı render ediliyor', async () => {
  render(<App />);
  const email = screen.getByTestId("email-input");
  fireEvent.change(email, { target: { value: "lorem" } });

  const error = screen.getByTestId("error");
  expect(error).toHaveTextContent(
    "Hata: email geçerli bir email adresi olmalıdır."
  );
});

test('soyad girilmeden gönderilirse "soyad gereklidir." mesajı render ediliyor', async () => {
  render(<App />);
  const name = screen.getByTestId("name-input");
  fireEvent.change(name, { target: { value: "lorem" } });

  const email = screen.getByTestId("email-input");
  fireEvent.change(email, { target: { value: "lorem@lorem.com" } });

  const submitBtn = screen.getByTestId("submit-btn");
  fireEvent.click(submitBtn);

  const error = screen.getByTestId("error");
  expect(error).toHaveTextContent("Hata: soyad gereklidir.");
});

test("ad,soyad, email render ediliyor. mesaj bölümü doldurulmadığında hata mesajı render edilmiyor.", async () => {
  render(<App />);
  const name = screen.getByTestId("name-input");
  fireEvent.change(name, { target: { value: "lorem" } });

  const surname = screen.getByTestId("surname-input");
  fireEvent.change(surname, { target: { value: "lorem" } });

  const email = screen.getByTestId("email-input");
  fireEvent.change(email, { target: { value: "lorem@lorem.com" } });

  await waitFor(() => {
    const errors = screen.queryAllByTestId("error");
    console.log(errors);
    expect(errors).toHaveLength(0);
  });
});

test("form gönderildiğinde girilen tüm değerler render ediliyor.", async () => {
  render(<App />);
  const name = screen.getByTestId("name-input");
  fireEvent.change(name, { target: { value: "lorem" } });

  const surname = screen.getByTestId("surname-input");
  fireEvent.change(surname, { target: { value: "lorem" } });

  const email = screen.getByTestId("email-input");
  fireEvent.change(email, { target: { value: "lorem@lorem.com" } });

  const submitBtn = screen.getByTestId("submit-btn");
  fireEvent.click(submitBtn);

  const displayName = screen.getByTestId("firstnameDisplay");
  expect(displayName).toHaveTextContent("Ad: lorem");

  const displaySurname = screen.getByTestId("lastnameDisplay");
  expect(displaySurname).toHaveTextContent("Soyad: lorem");

  const displayEmail = screen.getByTestId("emailDisplay");
  expect(displayEmail).toHaveTextContent("Email: lorem");
});
