package com.klu;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;

@Entity
public class Bookings {
    @Id
    private int pid; // Make this the primary key

    private String customer;
    private String car;
    private String date;
    private String pname;
    private int pcost;
    private String pimage;
    private int pqty;

    // Getters and Setters
    public int getPid() {
        return pid;
    }
    public void setPid(int pid) {
        this.pid = pid;
    }

    public String getCustomer() {
        return customer;
    }
    public void setCustomer(String customer) {
        this.customer = customer;
    }

    public String getCar() {
        return car;
    }
    public void setCar(String car) {
        this.car = car;
    }

    public String getDate() {
        return date;
    }
    public void setDate(String date) {
        this.date = date;
    }

    public String getPname() {
        return pname;
    }
    public void setPname(String pname) {
        this.pname = pname;
    }

    public int getPcost() {
        return pcost;
    }
    public void setPcost(int pcost) {
        this.pcost = pcost;
    }

    public String getPimage() {
        return pimage;
    }
    public void setPimage(String pimage) {
        this.pimage = pimage;
    }

    public int getPqty() {
        return pqty;
    }
    public void setPqty(int pqty) {
        this.pqty = pqty;
    }
}
