package com.klu;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;

@Entity
public class Locations {
    @Id
    int id;
    String city;
    String address;

    public int getId() {
        return id;
    }
    public void setId(int id) {
        this.id = id;
    }
    public String getCity() {
        return city;
    }
    public void setCity(String city) {
        this.city = city;
    }
    public String getAddress() {
        return address;
    }
    public void setAddress(String address) {
        this.address = address;
    }
}
